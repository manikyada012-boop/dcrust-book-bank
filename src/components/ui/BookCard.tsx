"use client";
import { BookOpen, User, GraduationCap, Loader2, Trash2, FileText, ExternalLink } from 'lucide-react';
import { useState } from 'react';
import { supabase } from '@/lib/supabase';

interface BookProps {
  id: number;
  user_id: string; // Owner of the book
  title: string;
  author: string;
  semester: string;
  status: string;
  pdf_url?: string; // Optional eBook link
  loggedInUserId?: string; // Currently logged-in user
  onRefresh: () => void;
}

export default function BookCard({ 
  id, 
  user_id, 
  title, 
  author, 
  semester, 
  status, 
  pdf_url, 
  loggedInUserId, 
  onRefresh 
}: BookProps) {
  const [loading, setLoading] = useState(false);
  
  // Logic to check if the current user owns this book
  const isOwner = loggedInUserId === user_id;

  const handleDelete = async () => {
    if (!confirm("Remove this resource from the library?")) return;
    
    setLoading(true);
    const { error } = await supabase
      .from('books')
      .delete()
      .eq('id', id);

    if (error) {
      alert("Error: " + error.message);
    } else {
      onRefresh();
    }
    setLoading(false);
  };

  return (
    <div className="bg-slate-800/40 border border-slate-700 p-5 rounded-[2rem] hover:border-indigo-500/50 transition-all group relative flex flex-col h-full shadow-xl">
      
      {/* Delete Action - Visible only to the person who donated it */}
      {isOwner && (
        <button 
          onClick={handleDelete}
          disabled={loading}
          className="absolute top-4 right-4 p-2 bg-red-500/10 text-red-500 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-500 hover:text-white z-10"
        >
          {loading ? <Loader2 size={16} className="animate-spin" /> : <Trash2 size={16} />}
        </button>
      )}

      {/* Visual Header */}
      <div className="aspect-video bg-slate-900 rounded-2xl mb-4 flex items-center justify-center border border-slate-700/50 overflow-hidden relative">
        <BookOpen size={40} className="text-slate-800 group-hover:text-indigo-500/20 transition-all group-hover:scale-110 duration-500" />
        {pdf_url && (
          <div className="absolute bottom-2 right-2 bg-indigo-600 text-[8px] font-bold uppercase px-2 py-1 rounded-md tracking-tighter">
            E-Book Available
          </div>
        )}
      </div>
      
      {/* Content */}
      <div className="flex flex-col flex-1">
        <div className="flex justify-between items-start mb-2">
          <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded-lg border ${
            status === 'Available' ? 'text-green-400 bg-green-400/5 border-green-400/20' : 'text-orange-400 bg-orange-400/5 border-orange-400/20'
          }`}>
            {status}
          </span>
          <div className="flex items-center text-slate-500 text-xs font-medium">
            <GraduationCap size={14} className="mr-1" />
            Sem {semester}
          </div>
        </div>
        
        <h3 className="font-bold text-white text-lg leading-tight mb-1 line-clamp-1">{title}</h3>
        <p className="text-sm text-slate-400 flex items-center mb-4"><User size={14} className="mr-1 opacity-50" /> {author}</p>

        {/* Action Buttons */}
        <div className="mt-auto space-y-2">
          {pdf_url ? (
            <a 
              href={pdf_url} 
              target="_blank" 
              rel="noopener noreferrer"
              className="w-full py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold transition-all flex items-center justify-center gap-2 shadow-lg shadow-indigo-500/20"
            >
              <FileText size={16} /> Read PDF
            </a>
          ) : (
            <button 
              className="w-full py-3 rounded-xl border border-slate-700 bg-slate-900/50 hover:border-indigo-500 hover:text-indigo-400 text-slate-400 text-xs font-bold transition-all flex items-center justify-center gap-2"
            >
              Request Physical Copy
            </button>
          )}
        </div>
      </div>
    </div>
  );
}