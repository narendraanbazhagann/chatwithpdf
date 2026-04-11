import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import { createClient } from '@/utils/supabase/server';
import ChatPanel from '@/components/ChatPanel';
import PdfViewer from '@/components/PdfViewer';
import Navbar from "@/components/Navbar";
import { cookies } from "next/headers";

interface ChatPageProps {
  params: Promise<{ id: string }>;
}

export default async function ChatPage({ params }: ChatPageProps) {
  const { id } = await params;
  const { userId } = await auth();

  if (!userId) {
    redirect('/sign-in');
  }

  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);

  // Fetch document details
  const { data: document, error } = await supabase
    .from('documents')
    .select('*')
    .eq('id', id)
    .eq('user_id', userId)
    .single();

  if (error || !document) {
    console.error('Document fetch error:', error);
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold">Document not found</h1>
          <p className="text-gray-500 mt-2">You don&apos;t have access to this document or it doesn&apos;t exist.</p>
        </div>
      </div>
    );
  }

  // Get public URL for the PDF
  const { data: { publicUrl } } = supabase.storage
    .from('chatwithpdf')
    .getPublicUrl(document.file_path);

  return (
    <div className="flex flex-col h-screen fixed inset-0 bg-white">
      {/* 1. Header Navigation */}
      <Navbar />

      {/* 2. Main content area: Split PDF and Chat */}
      <main className="flex-1 flex overflow-hidden border-t border-gray-200">
        {/* Left Side: PDF Viewer */}
        <div className="flex-[3] flex flex-col items-center bg-[#f8f9fa] overflow-y-auto border-r border-gray-200">
          <PdfViewer url={publicUrl} />
        </div>

        {/* Right Side: Chat Interface */}
        <div className="flex-[2] flex flex-col bg-white">
          <ChatPanel documentId={id} />
        </div>
      </main>
    </div>
  );
}
