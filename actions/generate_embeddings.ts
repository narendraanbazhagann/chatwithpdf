"use server";

import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import { generateEmbeddingsInPineconeVectorStore } from "@/lib/langchain";
import { createClient } from "@/utils/supabase/server";
import { cookies } from "next/headers";
import { after } from "next/server";

export async function generateEmbeddings(docId: string) {
    await auth.protect(); // Protect this route with Clerk

    console.log(`--- Starting embedding process for doc: ${docId} ---`);

    try {
        // We now AWAIT this properly to ensure it finishes before redirect
        await generateEmbeddingsInPineconeVectorStore(docId);
        console.log(`--- Successfully generated embeddings for doc: ${docId} ---`);
        revalidatePath("/dashboard");
        return { completed: true };
    } catch (error: any) {
        console.error(`--- Error in embeddings for ${docId}:`, error);
        
        // Update status to error in Supabase
        const cookieStore = await cookies();
        const supabase = createClient(cookieStore);
        await supabase
            .from("documents")
            .update({ status: "error" })
            .eq("id", docId);
        
        return { completed: false, error: `AI Processing failed: ${error.message || 'Unknown error'}` };
    }
}
