import { auth } from "@clerk/nextjs/server";
import { AIMessage, HumanMessage, SystemMessage } from "@langchain/core/messages";
import { GoogleGenerativeAIEmbeddings } from "@langchain/google-genai";
import { PineconeStore } from "@langchain/pinecone";
import { cookies } from "next/headers";
import { after } from "next/server";

import { indexName, model } from "@/lib/langchain";
import pineconeClient from "@/lib/pinecone";
import { createClient } from "@/utils/supabase/server";

import { createHistoryAwareRetriever } from "langchain/chains/history_aware_retriever";
import { createRetrievalChain } from "langchain/chains/retrieval";
import { createStuffDocumentsChain } from "langchain/chains/combine_documents";
import { ChatPromptTemplate, MessagesPlaceholder } from "@langchain/core/prompts";




interface ChatRequestBody {
  documentId?: string;
  prompt?: string;
  messages?: Array<{ role: "user" | "assistant"; content: string }>;
}

const encoder = new TextEncoder();

export async function POST(request: Request) {
  const { userId } = await auth();

  if (!userId) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  let body: ChatRequestBody;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "Invalid JSON payload." }, { status: 400 });
  }

  const documentId = body.documentId?.trim();
  const prompt = body.prompt?.trim();
  const history = Array.isArray(body.messages) ? body.messages : [];

  if (!documentId || !prompt) {
    return Response.json(
      { error: "documentId and prompt are required." },
      { status: 400 }
    );
  }

  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);

  // 1. Verify document access
  const { data: document, error: docError } = await supabase
    .from("documents")
    .select("id, name, status")
    .eq("id", documentId)
    .eq("user_id", userId)
    .single();

  if (docError || !document) {
    return Response.json({ error: "Document not found." }, { status: 404 });
  }

  // 2. Setup Vector Store
  const embeddings = new GoogleGenerativeAIEmbeddings({
    apiKey: process.env.GOOGLE_API_KEY,
    model: "text-embedding-004",
  });



  const index = await pineconeClient.index(indexName);
  const vectorStore = await PineconeStore.fromExistingIndex(embeddings, {
    pineconeIndex: index,
    namespace: documentId,
  });

  const retriever = vectorStore.asRetriever();

  // 3. Setup History-Aware Retriver
  const contextualizeQSystemPrompt = 
    "Given a chat history and the latest user question which might reference context in the chat history, formulate a standalone question which can be understood without the chat history. Do NOT answer the question, just reformulate it if needed and otherwise return it as is.";
  
  const contextualizeQPrompt = ChatPromptTemplate.fromMessages([
    ["system", contextualizeQSystemPrompt],
    new MessagesPlaceholder("chat_history"),
    ["human", "{input}"],
  ]);

  const historyAwareRetriever = await createHistoryAwareRetriever({
    llm: model,
    retriever,
    rephrasePrompt: contextualizeQPrompt,
  });

  // 4. Setup Question-Answering Chain
  const qaSystemPrompt = 
    "You are an assistant for question-answering tasks. Use the following pieces of retrieved context to answer the question. If you don't know the answer, just say that you don't know. Use three sentences maximum and keep the answer concise.\n\n{context}";
  
  const qaPrompt = ChatPromptTemplate.fromMessages([
    ["system", qaSystemPrompt],
    new MessagesPlaceholder("chat_history"),
    ["human", "{input}"],
  ]);

  const questionAnswerChain = await createStuffDocumentsChain({
    llm: model,
    prompt: qaPrompt,
  });

  // 5. Combine into RAG Chain
  const ragChain = await createRetrievalChain({
    retriever: historyAwareRetriever,
    combineDocsChain: questionAnswerChain,
  });

  // 6. Convert history to LangChain messages
  const chatHistory = history.map((msg) => 
    msg.role === "user" ? new HumanMessage(msg.content) : new AIMessage(msg.content)
  );

  // 7. Execute chain and Stream Response
  const stream = await ragChain.stream({
    chat_history: chatHistory,
    input: prompt,
  });

  let fullResponse = "";

  const responseStream = new ReadableStream({
    async start(controller) {
      try {
        for await (const chunk of stream) {
          if (chunk.answer) {
             fullResponse += chunk.answer;
             controller.enqueue(encoder.encode(chunk.answer));
          }
        }
        controller.close();
      } catch (error) {
        controller.error(error);
      }
    },
  });

  // 8. Background task: Save Assistant message to Supabase
  after(async () => {
    if (fullResponse) {
      await supabase.from("chat_messages").insert({
        document_id: documentId,
        user_id: userId,
        role: "assistant",
        content: fullResponse,
      });
    }
  });

  return new Response(responseStream, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "no-cache, no-transform",
    },
  });
}

