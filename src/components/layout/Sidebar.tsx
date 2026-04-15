import { 
  BookOpen, 
  LayoutDashboard, 
  HandHelping, 
  History, 
  MessageSquare, 
  User,
  Settings
} from 'lucide-react';
import AIChat from '../ui/AIChat'; // Import the AI component

const NavItem = ({ icon: Icon, label, active = false }: any) => (
  <div className={`
    flex items-center space-x-3 p-3 rounded-xl cursor-pointer transition-all duration-200
    ${active 
      ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/20' 
      : 'text-slate-400 hover:bg-slate-800 hover:text-slate-100'}
  `}>
    <Icon size={18} />
    <span className="font-medium text-sm">{label}</span>
  </div>
);

// We pass 'books' from page.tsx so Gemini knows what's in the library
export default function Sidebar({ books }: { books: any[] }) {
  return (
    <aside className="hidden md:flex w-72 border-r border-slate-800 p-6 flex-col h-screen sticky top-0 bg-[#0f172a] z-20">
      {/* Brand Logo */}
      <div className="flex items-center space-x-3 mb-8 px-2">
        <div className="bg-indigo-600 p-2 rounded-xl">
          <BookOpen size={20} className="text-white" />
        </div>
        <span className="text-xl font-bold tracking-tight text-white">
          BookBank<span className="text-indigo-500">.</span>
        </span>
      </div>
      
      {/* Navigation Links */}
      <nav className="space-y-1">
        <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest px-3 mb-3">Main Menu</p>
        <NavItem icon={LayoutDashboard} label="Explore Library" active />
        <NavItem icon={HandHelping} label="Donate a Book" />
        <NavItem icon={History} label="My Requests" />
      </nav>

      {/* Gemini AI Section */}
      <div className="mt-8">
        <AIChat books={books} />
      </div>

      {/* User Profile - Pushed to Bottom */}
      <div className="mt-auto pt-6 border-t border-slate-800">
        <div className="flex items-center space-x-3 p-2">
          <div className="h-9 w-9 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-500 flex items-center justify-center text-white font-bold text-xs">
            MY
          </div>
          <div className="overflow-hidden">
            <p className="text-sm font-bold text-white truncate">Manik Yadav</p>
            <p className="text-[10px] text-slate-500 uppercase font-semibold">DCRUST CSE</p>
          </div>
        </div>
      </div>
    </aside>
  );
}