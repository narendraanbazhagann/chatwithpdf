import { auth } from "@clerk/nextjs/server";
import { cookies } from "next/headers";
import { GoogleGenerativeAIEmbeddings } from "@langchain/google-genai";
import { PineconeStore } from "@langchain/pinecone";

import { generateDocs, indexName } from "@/lib/langchain";
import pineconeClient from "@/lib/pinecone";
import { createClient } from "@/utils/supabase/server";

interface IngestRequestBody {
  documentId?: string;
}

const INITIAL_INDEX_PAGE_LIMIT = 8;

export async function POST(request: Request) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    let body: IngestRequestBody;

    try {
      body = await request.json();
    } catch {
      return Response.json({ error: "Invalid JSON payload." }, { status: 400 });
    }

    const documentId = body.documentId?.trim();

    if (!documentId) {
      return Response.json({ error: "documentId is required." }, { status: 400 });
    }

    const cookieStore = await cookies();
    const supabase = createClient(cookieStore);

    const { data: document, error: docError } = await supabase
      .from("documents")
      .select("id")
      .eq("id", documentId)
      .eq("user_id", userId)
      .single();

    if (docError || !document) {
      return Response.json({ error: "Document not found." }, { status: 404 });
    }

    await supabase
      .from("documents")
      .update({ status: "processing" })
      .eq("id", documentId)
      .eq("user_id", userId);

    const splitDocs = await generateDocs(userId, documentId, {
      maxPages: INITIAL_INDEX_PAGE_LIMIT,
    });


    if (splitDocs.length === 0) {
      await supabase
        .from("documents")
        .update({ status: "error" })
        .eq("id", documentId)
        .eq("user_id", userId);

      return Response.json(
        { error: "No readable text found in this PDF." },
        { status: 422 }
      );
    }

    const embeddings = new GoogleGenerativeAIEmbeddings({
      apiKey: process.env.GOOGLE_API_KEY,
      model: "text-embedding-004",
    });

    const index = pineconeClient.index(indexName);
    await PineconeStore.fromDocuments(splitDocs, embeddings, {
      pineconeIndex: index,
      namespace: documentId,
    });

    await supabase
      .from("documents")
      .update({ status: "ready" })
      .eq("id", documentId)
      .eq("user_id", userId);

    return Response.json(
      {
        accepted: true,
        ready: true,
        indexedPages: INITIAL_INDEX_PAGE_LIMIT,
        indexedChunks: splitDocs.length,
      },
      { status: 200 }
    );
  } catch (err: any) {
    console.error("Ingestion error:", err);
    return Response.json(
      { error: err.message || "Internal server error during ingestion" },
      { status: 500 }
    );
  }
}
