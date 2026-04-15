"use client";
import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { LogIn, Loader2, X } from 'lucide-react';

export default function AuthModal({ isOpen, onClose }: { isOpen: boolean, onClose: () => void }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleAuth = async (type: 'LOGIN' | 'SIGNUP') => {
    setLoading(true);
    setError(null);
    
    const { error } = type === 'LOGIN' 
      ? await supabase.auth.signInWithPassword({ email, password })
      : await supabase.auth.signUp({ email, password });

    if (error) {
      setError(error.message);
    } else {
      onClose();
      window.location.reload(); // Refresh to update user state
    }
    setLoading(false);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
      <div className="bg-slate-900 border border-slate-800 w-full max-w-md p-8 rounded-[2.5rem] relative shadow-2xl">
        <button onClick={onClose} className="absolute right-6 top-6 text-slate-500 hover:text-white">
          <X size={20} />
        </button>

        <div className="text-center mb-8">
          <div className="bg-indigo-600 w-12 h-12 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <LogIn className="text-white" size={24} />
          </div>
          <h2 className="text-2xl font-bold">Welcome Back</h2>
          <p className="text-slate-400 text-sm mt-1">Join the DCRUST Book Bank community</p>
        </div>

        <div className="space-y-4">
          <input 
            type="email" 
            placeholder="College Email" 
            className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-sm focus:border-indigo-500 outline-none"
            onChange={(e) => setEmail(e.target.value)}
          />
          <input 
            type="password" 
            placeholder="Password" 
            className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-sm focus:border-indigo-500 outline-none"
            onChange={(e) => setPassword(e.target.value)}
          />
          
          {error && <p className="text-red-400 text-xs px-1">{error}</p>}

          <div className="flex gap-3 pt-2">
            <button 
              onClick={() => handleAuth('LOGIN')}
              disabled={loading}
              className="flex-1 bg-indigo-600 hover:bg-indigo-700 py-3 rounded-xl font-bold text-sm transition-all"
            >
              {loading ? <Loader2 className="animate-spin mx-auto" size={18} /> : "Login"}
            </button>
            <button 
              onClick={() => handleAuth('SIGNUP')}
              disabled={loading}
              className="flex-1 bg-slate-800 hover:bg-slate-700 py-3 rounded-xl font-bold text-sm transition-all text-slate-300"
            >
              Sign Up
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}