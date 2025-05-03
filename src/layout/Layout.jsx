import { Link } from 'react-router-dom';
import { useSession } from '../lib/SessionContext';
import { supabase } from '../lib/supabaseClient';

export default function Layout({ children }) {
  const { user } = useSession();

  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  return (
    <div className="flex h-screen bg-gray-100 font-sans">
      {/* Sidebar */}
      <aside className="hidden md:flex md:flex-col md:w-64 bg-gray-200 p-4 fixed h-full">
        <nav className="flex flex-col space-y-2">
          <Link to="/" className="text-black hover:underline">🏠 Home</Link>
          <Link to="/recipes" className="text-black hover:underline">📖 A–Z Recipes</Link>
          <Link to="/submit" className="text-black hover:underline">📝 Submit</Link>
          <Link to="/about" className="text-black hover:underline">📜 About</Link>
          {user && <Link to="/cookbook" className="text-black hover:underline">📚 My Cookbook</Link>}
          {user && <Link to="/moderate" className="text-black hover:underline">🛠 Moderate</Link>}
        </nav>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 md:ml-64 flex flex-col">
        {/* Header */}
        <header className="bg-gray-300 p-4 flex justify-between items-center">
          <div className="text-xl font-bold">Jump to Recipe</div>
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

        {/* Page Content */}
        <main className="p-6 overflow-y-auto">{children}</main>
      </div>
    </div>
  );
}
