"use client";

import { createClient } from "@/utils/supabase/client";
import { deleteDocument } from "@/actions/delete_document";
import { formatDistanceToNow } from "date-fns"; // Standard for "2 mins ago"
import { FileText, Loader2, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import Link from "next/link";

interface Document {
  id: string;
  name: string;
  file_path: string;
  created_at: string;
  status: string;
}

export default function DocumentList({ userId }: { userId: string }) {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  const fetchDocuments = async () => {
    try {
      const { getDocuments } = await import("@/actions/get_documents");
      const data = await getDocuments();
      setDocuments(data || []);
    } catch (err) {
      console.error("Error fetching documents:", err);
    } finally {
      setLoading(false);
    }
  };


  useEffect(() => {
    fetchDocuments();

    // Optional: Real-time updates if you want
    const channel = supabase
      .channel("document_updates")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "documents", filter: `user_id=eq.${userId}` },
        () => fetchDocuments()
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [userId, supabase]);

  const [deletingId, setDeletingId] = useState<string | null>(null);

  const removeDocument = async (doc: Document) => {
    if (!confirm("Are you sure you want to delete this document permanently? This will also remove all AI embeddings.")) return;

    // 1. OPTIMISTIC UPDATE: Remove from UI immediately
    const previousDocuments = [...documents];
    setDocuments(documents.filter((d) => d.id !== doc.id));
    setDeletingId(doc.id);

    try {
      // 2. Call server action
      await deleteDocument(doc.id);
      // No need to filter again, we already did it optimistically!
    } catch (err) {
      console.error("Delete error:", err);
      alert("Failed to delete document from database. It has been restored to your list.");
      // 3. ROLLBACK: If it truly failed to delete from the DB, put it back
      setDocuments(previousDocuments);
    } finally {
      setDeletingId(null);
    }
  };

  if (loading) {
    return (
      <div className="flex w-full justify-center p-12">
        <Loader2 className="h-8 w-8 animate-spin text-black/20" />
      </div>
    );
  }

  if (documents.length === 0) {
    return (
      <div className="w-full text-center p-12 text-black/40">
        <p>No documents found. Upload one to get started!</p>
      </div>
    );
  }

  return (
    <div className="mt-12 w-full max-w-6xl mx-auto px-4">
      <h2 className="text-xl font-semibold mb-6">My Documents</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {documents.map((doc) => (
          <div
            key={doc.id}
            className="group relative flex flex-col items-start gap-4 rounded-xl border border-black/10 bg-white/60 p-5 shadow-sm transition-all hover:shadow-md hover:border-black/20 backdrop-blur-sm"
          >
            <div className="flex items-start justify-between w-full">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-black/5 text-black/60">
                <FileText className="h-5 w-5" />
              </div>
              <button
                onClick={() => removeDocument(doc)}
                disabled={deletingId === doc.id}
                className={`${deletingId === doc.id ? 'opacity-100 cursor-not-allowed' : 'opacity-0 group-hover:opacity-100'} p-2 text-black/40 hover:text-red-500 transition-all`}
                title="Delete document"
              >
                {deletingId === doc.id ? (
                  <div className="h-4 w-4 border-2 border-red-500 border-t-transparent rounded-full animate-spin" />
                ) : (
                  <Trash2 className="h-4 w-4" />
                )}
              </button>
            </div>
            
            <div className="flex flex-col gap-1 w-full overflow-hidden">
               {doc.status === 'ready' ? (
                 <Link 
                    href={`/dashboard/chat/${doc.id}`}
                    className="text-sm font-semibold truncate hover:underline cursor-pointer"
                    title={doc.name}
                 >
                   {doc.name}
                 </Link>
               ) : (
                 <span className="text-sm font-semibold truncate opacity-50 cursor-not-allowed" title={doc.name}>
                   {doc.name} (Processing...)
                 </span>
               )}
               <p className="text-xs text-black/40">
                 {/* date-fns formatting simple fallback if not ready */}
                 {new Date(doc.created_at).toLocaleDateString()}
               </p>
            </div>

            <div className="mt-2 flex items-center justify-between w-full">
               <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                  doc.status === 'ready' ? 'bg-green-100 text-green-700' : 
                  doc.status === 'error' ? 'bg-red-100 text-red-700' : 
                  'bg-blue-100 text-blue-700 animate-pulse'
               }`}>
                 {doc.status || 'processing'}
               </span>
               
               {doc.status === 'ready' ? (
                 <Link 
                    href={`/dashboard/chat/${doc.id}`}
                    className="text-xs font-semibold text-black hover:opacity-70 transition-opacity"
                 >
                   Chat Now →
                 </Link>
               ) : (
                 <span className="text-xs font-semibold text-black/20 cursor-not-allowed">
                   Wait for AI...
                 </span>
               )}
            </div>

          </div>
        ))}
      </div>
    </div>
  );
}
