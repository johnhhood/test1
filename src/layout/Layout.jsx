import { Link } from 'react-router-dom';
import { useSession } from '../lib/SessionContext';
import { supabase } from '../lib/supabaseClient';

export default function Layout({ children }) {
  const { user } = useSession();

  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  return (
    <div className="flex h-screen bg-[#f0f0f0] font-comic-sans">
      {/* Sidebar (Windows 95-style gray) */}
      <aside className="hidden md:flex md:flex-col md:w-64 bg-[#c0c0c0] p-4 fixed h-full shadow-md border-r border-black space-y-4">
        <nav className="flex flex-col space-y-3 text-black text-sm font-semibold">
          <Link to="/" className="hover:underline">🏠 Home</Link>
          <Link to="/recipes" className="hover:underline">📖 A–Z Recipes</Link>
          <Link to="/submit" className="hover:underline">📝 Submit</Link>
          <Link to="/about" className="hover:underline">📜 About</Link>
          {user && <Link to="/cookbook" className="hover:underline">📚 My Cookbook</Link>}
          {user && <Link to="/moderate" className="hover:underline">🛠 Moderate</Link>}
        </nav>
      </aside>

      {/* Main content area */}
      <div className="flex-1 md:ml-64 flex flex-col">
        {/* Header (cyan theme) */}
        <header className="bg-[#00bfff] text-black p-4 flex justify-between items-center border-b-2 border-black shadow">
          <div className="font-bold text-xl">Jump to Recipe</div>
          <div className="text-sm space-x-2">
            {user ? (
              <>
                <span>{user?.user_metadata?.name || user?.email}</span>
                <button onClick={handleLogout} className="underline text-red-600">Log out</button>
              </>
            ) : (
              <Link to="/login" className="underline text-blue-600">Log in</Link>
            )}
          </div>
        </header>

        {/* Page content tile */}
        <main className="p-6 m-4 bg-white rounded-lg shadow-lg border border-gray-300 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
