"use client"

import { useState, useRef, useEffect, useTransition } from 'react';
import { Send, Bot, User, Loader2 } from 'lucide-react';
import { useUser } from '@clerk/nextjs';
import { useChatMessages } from '@/hooks/use-chat-messages';
import { createClient } from '@/utils/supabase/client';

export default function ChatPanel({ documentId }: { documentId: string }) {
  const { user } = useUser();
  const { messages, loading, setMessages } = useChatMessages(documentId);
  const [input, setInput] = useState('');
  const [isPending, startTransition] = useTransition();
  const scrollRef = useRef<HTMLDivElement>(null);
  const supabase = createClient();

  // Scroll to bottom whenever messages change
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isPending]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isPending) return;

    const userPrompt = input.trim();
    setInput('');

    startTransition(async () => {
      try {
        // 1. Save User Message to Supabase (Optimistic + Persist)
        const { data: userMsg, error: userMsgError } = await supabase
          .from('chat_messages')
          .insert({
            document_id: documentId,
            user_id: user?.id,
            role: 'user',
            content: userPrompt,
          })
          .select()
          .single();

        if (userMsgError) throw userMsgError;

        // 2. Fetch the AI response from our API
        // This API will also save the assistant message to Supabase
        const response = await fetch('/api/chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            documentId,
            prompt: userPrompt,
            // We pass history for context, but the API can also fetch from DB
            messages: messages.map(m => ({ role: m.role, content: m.content })),
          }),
        });

        if (!response.ok) {
           throw new Error('Failed to get AI response');
        }

        // The API handles saving the assistant message, 
        // and our Realtime hook will pick it up automatically.
        // If we want to stream it in the UI, we'd need more logic here,
        // but let's stick to the tutorial's "optimistic update" flow first.
        
      } catch (error) {
        console.error("Chat error:", error);
        // Error handling could be adding a system message or alert
      }
    });
  };

  return (
    <div className="flex flex-col h-full bg-[#f8f8f8] [font-family:var(--font-schibsted-grotesk)]">
      {/* 1. Chat Header */}
      <div className="bg-white px-6 py-4 border-b border-gray-100 flex items-center justify-between shadow-sm">
        <h2 className="text-lg font-bold text-black tracking-tight">Chat With Document</h2>
      </div>

      {/* 2. Chat Messages Area */}
      <div 
        ref={scrollRef}
        className="flex-1 overflow-y-auto p-4 space-y-6 pt-6 bg-white"
        style={{ scrollBehavior: 'smooth' }}
      >
        {messages.length === 0 && !loading && (
          <div className="flex flex-col items-center justify-center h-full text-center p-8 opacity-50">
             <Bot className="h-12 w-12 mb-4" />
             <p className="text-sm font-medium">Ask any question about this document to get started!</p>
          </div>
        )}

        {messages.map((message) => (
          <div 
            key={message.id} 
            className={`flex items-start gap-3 ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            {message.role === 'assistant' && (
              <div className="w-9 h-9 shrink-0 rounded-full bg-black flex items-center justify-center text-white shadow-md">
                <Bot className="h-5 w-5" />
              </div>
            )}
            
            <div className={`
              max-w-[85%] px-5 py-4 rounded-2xl text-sm leading-relaxed tracking-tight font-medium
              ${message.role === 'user' 
                ? 'bg-black text-white rounded-tr-none shadow-lg' 
                : 'bg-[#2A2F3D] text-white rounded-tl-none shadow-md'
              }
            `}>
              {message.content}
            </div>

            {message.role === 'user' && (
               <div className="w-9 h-9 shrink-0 rounded-full overflow-hidden bg-gray-200 shadow-sm border-2 border-white">
                 {user?.imageUrl ? (
                    <img src={user.imageUrl} alt="user" className="w-full h-full object-cover" />
                 ) : (
                    <User className="w-5 h-5 m-auto text-gray-400" />
                 )}
               </div>
            )}
          </div>
        ))}

        {isPending && (
          <div className="flex items-start gap-3">
             <div className="w-9 h-9 rounded-full bg-black flex items-center justify-center text-white animate-pulse">
                <Bot className="h-5 w-5" />
             </div>
             <div className="bg-[#2A2F3D] text-white px-5 py-4 rounded-2xl rounded-tl-none text-sm transition-all animate-in fade-in slide-in-from-left-2 shadow-md">
                <div className="flex gap-1">
                   <div className="w-1.5 h-1.5 bg-white/40 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                   <div className="w-1.5 h-1.5 bg-white/40 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                   <div className="w-1.5 h-1.5 bg-white/40 rounded-full animate-bounce"></div>
                </div>
             </div>
          </div>
        )}
      </div>

      {/* 3. Message Input */}
      <div className="p-4 bg-white border-t border-gray-100">
        <form onSubmit={handleSubmit} className="flex items-center gap-2 max-w-full">
          <div className="relative flex-1">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask a Question..."
              disabled={isPending}
              className="w-full pl-5 pr-12 py-3.5 bg-gray-50 border border-black/5 rounded-xl focus:outline-none focus:ring-2 focus:ring-black/10 focus:border-black text-sm text-black placeholder-gray-400 transition-all font-medium disabled:opacity-50"
            />
            <button
              type="submit"
              disabled={!input.trim() || isPending}
              className="absolute right-2 top-1/2 -translate-y-1/2 bg-black text-white p-2 rounded-lg hover:opacity-80 transition-opacity disabled:opacity-30 flex items-center"
            >
              {isPending ? (
                 <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                 <Send className="h-4 w-4" />
              ) }
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

