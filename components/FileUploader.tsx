"use client";

import { createClient } from "@/utils/supabase/client";
import { ArrowDown, Loader2, X } from "lucide-react";
import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { useRouter } from "next/navigation";

// Optional: If you use toast notifications
// import { toast } from "sonner"; 

interface FileWithStatus {
  file: File;
  status: "idle" | "uploading" | "success" | "error";
  progress: number;
}

const WARMUP_WAIT_TIMEOUT_MS = 12000;

export default function FileUploader({ userId }: { userId: string }) {
  const [uploading, setUploading] = useState(false);
  const [fileData, setFileData] = useState<FileWithStatus | null>(null);
  const supabase = createClient();
  const router = useRouter();

  const [statusText, setStatusText] = useState("");

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (!file) return;

    setUploading(true);
    setFileData({ file, status: "uploading", progress: 0 });
    setStatusText("Uploading to secure storage...");

    try {
      if (!userId) throw new Error("Please sign in to upload files.");

      // 1. Upload to Supabase Storage
      const fileExt = file.name.split(".").pop();
      const fileName = `${userId}-${Math.random().toString(36).substring(2)}.${fileExt}`;
      const filePath = `documents/${userId}/${fileName}`;
      console.log(`--- Attempting to upload to path: ${filePath} ---`);

      const { data: storageData, error: storageError } = await supabase.storage
        .from("chatwithpdf")
        .upload(filePath, file, {
          cacheControl: "3600",
          upsert: false,
        });

      if (storageError) {
        console.error("Storage upload error:", storageError);
        throw storageError;
      }
      
      console.log("--- Storage upload success. Data:", storageData);

      // 2. Save record to Database
      setStatusText("Finalizing document...");
      const { data: dbData, error: dbError } = await supabase.from("documents").insert({
        name: file.name,
        file_path: storageData.path,
        user_id: userId,
        status: "processing",
      }).select().single();

      if (dbError || !dbData) {
        await supabase.storage.from("chatwithpdf").remove([storageData.path]);
        throw dbError || new Error("Failed to create document record.");
      }

      // 3. Trigger ingestion API in the background
      // We don't await the full result here to keep the UI fast.
      // The DocumentList will pick up the 'ready' status via Realtime.
      console.log("--- Triggering background AI Processing for doc:", dbData.id);
      
      fetch("/api/ingest", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ documentId: dbData.id }),
      }).catch(err => console.error("Background ingestion trigger failed:", err));

      // 4. Success state and immediate redirect
      setFileData({ file, status: "success", progress: 100 });
      setStatusText("Document added! Redirecting to your list...");
      
      setTimeout(() => {
        router.push(`/dashboard`);
      }, 500);

    } catch (err: unknown) {
      console.error("Upload error detail:", err);
      const errorMessage = err instanceof Error ? err.message : "Failed to upload file.";
      setFileData({ file, status: "error", progress: 0 });
      alert(`Upload Error: ${errorMessage}`);
    } finally {
      setUploading(false);
    }

  }, [userId, supabase, router]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "application/pdf": [".pdf"] },
    multiple: false,
    disabled: uploading,
  });

  return (
    <div className="w-full max-w-4xl mx-auto">
      <div
        {...getRootProps()}
        className={`relative flex min-h-[50vh] w-full cursor-pointer flex-col items-center justify-center gap-4 rounded-2xl border-2 border-dashed transition-all duration-200 sm:h-[62vh] sm:rounded-3xl sm:gap-5 ${isDragActive
            ? "border-black bg-white/90 scale-[1.01]"
            : "border-black/25 bg-[rgba(255,255,255,0.72)] hover:border-black/40 hover:bg-white/80"
          } ${uploading ? "cursor-not-allowed opacity-80" : ""} p-6 text-center shadow-[0_20px_45px_rgba(0,0,0,0.12)] backdrop-blur-sm`}
      >
        <input {...getInputProps()} />

        {uploading ? (
          <div className="flex flex-col items-center gap-4">
            <Loader2 className="h-12 w-12 animate-spin text-black/40" />
            <div className="space-y-1">
              <p className="text-lg font-semibold">{statusText || `Processing ${fileData?.file.name}...`}</p>
              <p className="text-sm text-black/60">AI is chunking and indexing your document.</p>
            </div>
          </div>
        ) : (
          <>
            <div className={`flex h-12 w-12 items-center justify-center rounded-full border transition-all duration-300 sm:h-16 sm:w-16 ${isDragActive ? "border-black bg-black scale-110" : "border-black/30 bg-white/85"
              }`}>
              <ArrowDown className={`h-5 w-5 sm:h-7 sm:w-7 transition-colors duration-300 ${isDragActive ? "text-white" : "text-black"
                }`} />
            </div>
            <div className="space-y-2">
              <p className="text-sm [font-family:var(--font-fustat)] sm:text-base">
                {isDragActive ? (
                  <span className="font-semibold text-black">Drop the PDF here...</span>
                ) : (
                  <>
                    Drag & drop files here, or{" "}
                    <span className="font-semibold text-black">click to select</span>
                  </>
                )}
              </p>
              <p className="text-xs text-black/40 sm:text-sm">Only PDF files are supported (max 10MB)</p>
            </div>
          </>
        )}

        {/* Status Indicators */}
        {fileData?.status === "error" && (
          <div className="mt-4 flex items-center gap-2 rounded-lg bg-red-50 px-4 py-2 text-sm text-red-600">
            <X className="h-4 w-4" />
            <span>Upload failed. Click to try again.</span>
          </div>
        )}
      </div>
    </div>
  );
}
