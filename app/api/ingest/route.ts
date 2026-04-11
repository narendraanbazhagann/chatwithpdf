import { auth } from "@clerk/nextjs/server";
import { cookies } from "next/headers";
import { createClient } from "@/utils/supabase/server";

interface IngestRequestBody {
  documentId?: string;
}

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

    // Verify document access
    const { data: document, error: docError } = await supabase
      .from("documents")
      .select("id")
      .eq("id", documentId)
      .eq("user_id", userId)
      .single();

    if (docError || !document) {
      return Response.json({ error: "Document not found." }, { status: 404 });
    }

    // Skip AI processing for now, just mark it as ready
    await supabase
      .from("documents")
      .update({ status: "ready" })
      .eq("id", documentId)
      .eq("user_id", userId);

    return Response.json(
      {
        accepted: true,
        ready: true,
        message: "AI processing is currently disabled. Document is marked as ready for test purposes."
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
