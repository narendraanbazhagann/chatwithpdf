import { ChatGoogleGenerativeAI, GoogleGenerativeAIEmbeddings } from "@langchain/google-genai";
import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";
import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";
import { createStuffDocumentsChain } from "langchain/chains/combine_documents";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import { createRetrievalChain } from "langchain/chains/retrieval";
import { createHistoryAwareRetriever } from "langchain/chains/history_aware_retriever";

import { HumanMessage, AIMessage } from "@langchain/core/messages";
import pineconeClient from "./pinecone";
import { PineconeStore } from "@langchain/pinecone";
import { auth } from "@clerk/nextjs/server";
import { createClient } from "@/utils/supabase/server";

import { cookies } from "next/headers";

if (!process.env.GOOGLE_API_KEY) {
    throw new Error("GOOGLE_API_KEY is not set. Please add it to your .env.local file.");
}

// Initialize the Gemini model (Pro 1.5 is excellent for RAG)
const model = new ChatGoogleGenerativeAI({
    apiKey: process.env.GOOGLE_API_KEY,
    model: "gemini-1.5-pro",
    maxOutputTokens: 2048,
});

export const indexName = "chatpdf";

interface GenerateDocsOptions {
    maxPages?: number;
}

export async function generateDocs(userId: string, docId: string, options?: GenerateDocsOptions) {
    console.log(`--- [generateDocs] Starting for doc: ${docId}, user: ${userId} ---`);

    console.log("--- Fetching the download URL from Supabase... ---");
    const cookieStore = await cookies();
    const supabase = createClient(cookieStore);

    // 1. Fetch file record from Supabase
    console.log(`[1/4] Fetching file path for ${docId}...`);
    const { data: document, error: docError } = await supabase
        .from("documents")
        .select("file_path")
        .eq("id", docId)
        .eq("user_id", userId) // Ensure ownership
        .single();

    if (docError || !document) {
        console.error("DB Fetch Error:", docError);
        throw new Error(`Document record not found or access denied: ${docError?.message || "Unknown error"}`);
    }

    console.log(`[2/4] Generating secure signed URL for ${document.file_path}...`);
    const { data: urlData, error: urlError } = await supabase.storage
        .from("chatwithpdf")
        .createSignedUrl(document.file_path, 60);

    if (urlError || !urlData) {
        console.error("Signed URL Error:", urlError);
        throw new Error("Failed to generate download URL");
    }

    const downloadUrl = urlData.signedUrl;
    console.log(`[3/4] Downloading PDF content...`);
    const response = await fetch(downloadUrl);
    
    if (!response.ok) {
        throw new Error(`Failed to download PDF: ${response.statusText}`);
    }

    const arrayBuffer = await response.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const data = new Blob([buffer]);

    // Load the PDF into LangChain documents
    console.log("[4/4] Loading PDF into LangChain via PDFLoader...");
    const loader = new PDFLoader(data);
    const docs = await loader.load();

    const cappedDocs =
        options?.maxPages && options.maxPages > 0
            ? docs.slice(0, options.maxPages)
            : docs;

    // Split the documents into smaller parts
    console.log(`--- Splitting ${cappedDocs.length} pages into chunks... ---`);
    const splitter = new RecursiveCharacterTextSplitter({
        chunkSize: 6000,
        chunkOverlap: 120,
    });
    const splitDocs = await splitter.splitDocuments(cappedDocs);

    console.log(`--- Split into ${splitDocs.length} parts ---`);
    return splitDocs;
}

async function namespaceExists(index: Index<RecordMetadata>, namespace: string) {
    if (namespace === null) throw new Error("No namespace value provided.");
    const { namespaces } = await index.describeIndexStats();
    return namespaces?.[namespace] !== undefined;
}

export async function generateEmbeddingsInPineconeVectorStore(userId: string, docId: string) {
    console.log(`--- [generateEmbeddings] Starting for doc: ${docId} ---`);

    let pineconeVectorStore;

    // Use Google for embeddings (requires 768 dimensions in Pinecone)
    const embeddings = new GoogleGenerativeAIEmbeddings({
        apiKey: process.env.GOOGLE_API_KEY,
        model: "text-embedding-004", 
    });


    const index = pineconeClient.index(indexName);
    console.log(`--- Processing embeddings for namespace: ${docId} ---`);

    const splitDocs = await generateDocs(userId, docId);
    console.log(`--- Storing ${splitDocs.length} chunks in Pinecone... ---`);

    pineconeVectorStore = await PineconeStore.fromDocuments(
        splitDocs,
        embeddings,
        {
            pineconeIndex: index,
            namespace: docId,
        }
    );

    // Update status to 'ready'
    console.log("--- Updating document status to 'ready' in Supabase... ---");
    const cookieStore = await cookies();
    const supabase = createClient(cookieStore);
    await supabase
        .from("documents")
        .update({ status: "ready" })
        .eq("id", docId)
        .eq("user_id", userId);

    console.log("--- [generateEmbeddings] COMPLETED Successfully ---");
    return pineconeVectorStore;
}

export { model };
