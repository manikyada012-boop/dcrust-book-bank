"use client";
import { useState, useEffect } from 'react';
import Sidebar from '@/components/layout/Sidebar';
import BookCard from '@/components/ui/BookCard';
import DonateModal from '@/components/ui/DonateModal';
import AuthModal from '@/components/auth/AuthModal';
import { supabase } from '@/lib/supabase';
import { Search, Plus, Loader2, Library, BookOpen } from 'lucide-react';

export default function Home() {
  const [user, setUser] = useState<any>(null);
  const [books, setBooks] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeSemester, setActiveSemester] = useState("All");
  const [showOnlyEbooks, setShowOnlyEbooks] = useState(false);
  
  const [isDonateOpen, setIsDonateOpen] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => setUser(session?.user ?? null));
    supabase.auth.onAuthStateChange((_event, session) => setUser(session?.user ?? null));
    fetchBooks();
  }, []);

  const fetchBooks = async () => {
    setIsLoading(true);
    const { data } = await supabase.from('books').select('*').order('created_at', { ascending: false });
    if (data) setBooks(data);
    setIsLoading(false);
  };

  const filteredBooks = books.filter((book) => {
    const matchesSearch = book.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesSemester = activeSemester === "All" || book.semester.toString() === activeSemester;
    const matchesEbook = !showOnlyEbooks || book.pdf_url !== null;
    return matchesSearch && matchesSemester && matchesEbook;
  });

  return (
    <div className="flex min-h-screen bg-[#0f172a] text-white">
      <Sidebar books={books} />
      
      <main className="flex-1 flex flex-col h-screen overflow-y-auto">
        <header className="h-20 border-b border-slate-800 flex items-center justify-between px-8 bg-[#0f172a]/80 backdrop-blur-md sticky top-0 z-30">
          <div className="relative w-full max-w-md">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
            <input placeholder="Search..." className="w-full bg-slate-900 border border-slate-700 rounded-xl py-2.5 pl-11 pr-4 text-sm outline-none" onChange={(e) => setSearchQuery(e.target.value)} />
          </div>

          <div className="flex gap-4">
            <button onClick={() => setShowOnlyEbooks(!showOnlyEbooks)} 
              className={`px-4 py-2 rounded-xl text-xs font-bold border transition-all ${showOnlyEbooks ? 'bg-indigo-600 border-indigo-500' : 'border-slate-700 text-slate-400'}`}>
              {showOnlyEbooks ? "E-Books Only" : "All Resources"}
            </button>
            <button onClick={() => user ? setIsDonateOpen(true) : setIsAuthOpen(true)} className="bg-indigo-600 px-6 py-2.5 rounded-xl text-sm font-bold flex items-center gap-2">
              <Plus size={18} /> Donate
            </button>
          </div>
        </header>

        <div className="p-8 max-w-7xl mx-auto w-full">
          <div className="flex items-center space-x-3 mb-10 overflow-x-auto pb-4 no-scrollbar">
            {["All", "1", "2", "3", "4", "5", "6", "7", "8"].map((sem) => (
              <button key={sem} onClick={() => setActiveSemester(sem)}
                className={`px-5 py-2 rounded-lg text-xs font-bold border transition-all ${activeSemester === sem ? "bg-indigo-600 border-indigo-500 text-white" : "bg-slate-800/50 border-slate-700 text-slate-500 hover:text-white"}`}>
                {sem === "All" ? "All Semesters" : `Sem ${sem}`}
              </button>
            ))}
          </div>

          {isLoading ? (
            <div className="flex justify-center py-20"><Loader2 className="animate-spin text-indigo-500" size={40} /></div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 pb-20">
              {filteredBooks.map((book) => (
                <BookCard key={book.id} {...book} loggedInUserId={user?.id} onRefresh={fetchBooks} />
              ))}
            </div>
          )}
        </div>
      </main>

      <AuthModal isOpen={isAuthOpen} onClose={() => setIsAuthOpen(false)} />
      <DonateModal isOpen={isDonateOpen} onClose={() => { setIsDonateOpen(false); fetchBooks(); }} />
    </div>
  );
}