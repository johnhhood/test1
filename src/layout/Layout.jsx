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
      {/* Sidebar */}
      <aside className="hidden md:flex flex-col w-56 bg-yellow-300 p-4 space-y-4">
        <Link to="/" className="font-bold text-lg text-black hover:underline">🏠 Home</Link>
        <Link to="/recipes" className="text-black hover:underline">📖 A–Z Recipes</Link>
        <Link to="/submit" className="text-black hover:underline">📝 Submit</Link>
        <Link to="/about" className="text-black hover:underline">📜 About</Link>
        {user && <Link to="/cookbook" className="text-black hover:underline">📚 My Cookbook</Link>}
        {user && <Link to="/moderate" className="text-black hover:underline">🛠 Moderate</Link>}
      </aside>

      {/* Main content area */}
      <div className="flex-1 flex flex-col">
        {/* Top header */}
        <header className="bg-cyan-300 text-black p-4 flex justify-between items-center border-b">
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

        {/* Page content */}
        <main className="p-6 overflow-y-auto">{children}</main>
      </div>
    </div>
  );
}
