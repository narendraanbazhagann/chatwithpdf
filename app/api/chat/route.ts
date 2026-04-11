import { auth } from "@clerk/nextjs/server";
import { cookies } from "next/headers";
import { after } from "next/server";
import { createClient } from "@/utils/supabase/server";

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

  // 2. Static response since AI is disabled
  const staticResponse = "AI is processing your document... (Note: AI functionality is currently disabled for testing/deployment purposes).";

  const responseStream = new ReadableStream({
    async start(controller) {
      controller.enqueue(encoder.encode(staticResponse));
      controller.close();
    },
  });

  // 3. Background task: Save Assistant message to Supabase
  after(async () => {
    await supabase.from("chat_messages").insert({
      document_id: documentId,
      user_id: userId,
      role: "assistant",
      content: staticResponse,
    });
  });

  return new Response(responseStream, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "no-cache, no-transform",
    },
  });
}
