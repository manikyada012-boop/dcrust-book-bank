"use client";
import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { X, Loader2, BookPlus, FileText, UploadCloud } from 'lucide-react';

export default function DonateModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [semester, setSemester] = useState("1");
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  const handleUpload = async (file: File) => {
    const fileExt = file.name.split('.').pop();
    const fileName = `${Math.random()}.${fileExt}`;
    const filePath = `ebooks/${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from('ebooks')
      .upload(filePath, file);

    if (uploadError) throw uploadError;

    const { data } = supabase.storage.from('ebooks').getPublicUrl(filePath);
    return data.publicUrl;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Please login first");

      let pdfUrl = null;
      if (file) {
        pdfUrl = await handleUpload(file);
      }

      const { error } = await supabase.from('books').insert([
        { title, author, semester, pdf_url: pdfUrl, user_id: user.id, status: 'Available' }
      ]);

      if (error) throw error;
      onClose();
    } catch (err: any) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-md">
      <div className="bg-slate-900 border border-slate-800 w-full max-w-lg p-8 rounded-[2.5rem] relative">
        <button onClick={onClose} className="absolute right-6 top-6 text-slate-500 hover:text-white"><X size={24} /></button>
        
        <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
          <BookPlus className="text-indigo-500" /> Add Resource
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input required placeholder="Book Title" className="w-full bg-slate-950 border border-slate-800 rounded-xl p-4 text-sm" 
            value={title} onChange={(e) => setTitle(e.target.value)} />
          
          <input required placeholder="Author" className="w-full bg-slate-950 border border-slate-800 rounded-xl p-4 text-sm" 
            value={author} onChange={(e) => setAuthor(e.target.value)} />

          <select className="w-full bg-slate-950 border border-slate-800 rounded-xl p-4 text-sm" 
            value={semester} onChange={(e) => setSemester(e.target.value)}>
            {[1,2,3,4,5,6,7,8].map(s => <option key={s} value={s}>Semester {s}</option>)}
          </select>

          <div className="border-2 border-dashed border-slate-800 rounded-2xl p-6 text-center hover:border-indigo-500/50 transition-colors">
            <input type="file" accept=".pdf" className="hidden" id="pdf-upload" onChange={(e) => setFile(e.target.files?.[0] || null)} />
            <label htmlFor="pdf-upload" className="cursor-pointer flex flex-col items-center">
              <UploadCloud size={32} className="text-slate-600 mb-2" />
              <span className="text-xs text-slate-400">{file ? file.name : "Upload E-Book (PDF) - Optional"}</span>
            </label>
          </div>

          <button disabled={loading} className="w-full bg-indigo-600 hover:bg-indigo-700 py-4 rounded-2xl font-bold flex justify-center items-center gap-2">
            {loading ? <Loader2 className="animate-spin" /> : "Publish to Bank"}
          </button>
        </form>
      </div>
    </div>
  );
}