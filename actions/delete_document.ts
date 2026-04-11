"use server";

import { auth } from "@clerk/nextjs/server";
import { createClient } from "@/utils/supabase/server";
import { cookies } from "next/headers";
import pineconeClient from "@/lib/pinecone";
import { indexName } from "@/lib/langchain";
import { revalidatePath } from "next/cache";

export async function deleteDocument(docId: string) {
  const { userId } = await auth();
  if (!userId) {
    throw new Error("Unauthorized");
  }

  console.log(`--- Starting strict deletion for doc: ${docId} ---`);

  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);

  try {
    // 1. Get document details for cleanup
    console.log(`[1/4] Fetching document details for ID: ${docId}`);
    const { data: document, error: fetchError } = await supabase
      .from("documents")
      .select("file_path, user_id")
      .eq("id", docId)
      .eq("user_id", userId)
      .single();

    if (fetchError || !document) {
      console.warn("Document not found or access denied, checking if it exists at all...");
      // If it doesn't exist for this user, we can't delete it.
      if (fetchError?.code === 'PGRST116') {
         throw new Error("Document not found in your account.");
      }
      throw new Error(fetchError?.message || "Could not find document to delete.");
    }

    // 2. Cleanup storage assets
    if (document?.file_path) {
      console.log(`[2/4] Attempting to delete from storage: ${document.file_path}`);
      const { data: removeData, error: storageError } = await supabase.storage
        .from("chatwithpdf")
        .remove([document.file_path]);
        
      if (storageError) {
        console.error("Storage deletion FAILED:", storageError.message);
        throw new Error(`Storage cleanup failed: ${storageError.message}`);
      }
      
      console.log("Storage deletion result:", removeData);
      
      if (removeData && removeData.length === 0) {
        console.warn("Storage report: No files were deleted. Check if path matches exactly.");
      } else {
        console.log("Storage report: File deleted successfully.");
      }
    }

    // 3. Delete from Database
    console.log(`[3/4] Deleting record from database: ${docId}`);
    const { error: dbError } = await supabase
      .from("documents")
      .delete()
      .eq("id", docId)
      .eq("user_id", userId);

    if (dbError) {
      console.error("Supabase DB Delete Error:", dbError);
      throw new Error(`Database deletion failed: ${dbError.message}`);
    }

    // 4. Cleanup Pinecone embeddings (DISABLED for now)
    console.log(`[4/4] Skipping Pinecone cleanup (AI disabled)`);
    
    revalidatePath("/dashboard");
    return { success: true };
  } catch (error: any) {
    console.error("CRITICAL error in deleteDocument:", error);
    // Rethrow with a clean message for the frontend
    throw new Error(error.message || "Failed to delete document fully");
  }
}
