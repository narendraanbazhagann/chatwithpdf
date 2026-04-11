"use server";

import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";

export async function generateEmbeddings(docId: string) {
    await auth.protect(); 

    console.log(`--- Skipping actual embedding process for doc (AI Disabled): ${docId} ---`);

    try {
        revalidatePath("/dashboard");
        return { completed: true };
    } catch (error: any) {
        return { completed: false, error: "Processing disabled" };
    }
}
