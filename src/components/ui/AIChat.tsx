"use client";
import { useState } from 'react';
import { MessageSquare, Send, Loader2, Bot } from 'lucide-react';

export default function AIChat({ books }: { books: any[] }) {
  const [input, setInput] = useState("");
  const [response, setResponse] = useState("");
  const [loading, setLoading] = useState(false);

  const askGemini = async () => {
    if (!input) return;
    setLoading(true);
    setResponse("");

    try {
      const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY;
      
      // We MANUALLY set the URL to v1 to stop the 404 error
      const url = `https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent?key=${apiKey}`;

      const payload = {
        contents: [{
          parts: [{
            text: `You are the DCRUST University BookBank Assistant. 
            Here is the current library data: ${JSON.stringify(books)}. 
            
            Rules:
            1. If a student asks for a book we have, mention the title and author.
            2. If we don't have it, suggest they donate it.
            3. Keep the answer under 2 sentences.
            
            Student Question: ${input}`
          }]
        }]
      };

      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      const data = await res.json();

      if (data.candidates && data.candidates[0].content.parts[0].text) {
        setResponse(data.candidates[0].content.parts[0].text);
      } else {
        throw new Error("Invalid API response structure");
      }

    } catch (error: any) {
      console.error("Gemini Fetch Error:", error);
      setResponse("I'm having trouble connecting to the library brain. Try again?");
    }
    setLoading(false);
    setInput("");
  };

  return (
    <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-4 mt-6">
      <div className="flex items-center space-x-2 mb-4 text-indigo-400 border-b border-slate-800/50 pb-2">
        <Bot size={18} />
        <span className="text-[11px] font-bold uppercase tracking-widest">Gemini Librarian</span>
      </div>

      {response && (
        <div className="bg-indigo-500/10 border border-indigo-500/20 p-3 rounded-xl text-[11px] text-slate-200 mb-4 animate-in fade-in slide-in-from-bottom-2">
          {response}
        </div>
      )}

      <div className="relative">
        <input 
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && askGemini()}
          placeholder="Ask about a book..."
          className="w-full bg-slate-950 border border-slate-800 rounded-xl py-2.5 pl-3 pr-10 text-xs text-white focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none transition-all"
        />
        <button 
          onClick={askGemini}
          disabled={loading}
          className="absolute right-2 top-1/2 -translate-y-1/2 text-indigo-500 hover:text-indigo-400 disabled:text-slate-700 transition-colors"
        >
          {loading ? <Loader2 size={16} className="animate-spin" /> : <Send size={16} />}
        </button>
      </div>
    </div>
  );
}