import { Link } from 'react-router-dom';
import { useSession } from '../lib/SessionContext';
import { supabase } from '../lib/supabaseClient';

export default function Layout({ children }) {
  const { user } = useSession();

  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  return (
    <div>
      <nav className="bg-gray-100 border-b p-4 flex justify-between items-center">
        <div className="space-x-4">
          <Link to="/" className="font-bold" className="text-gray-600 hover:text-black">Jump to Recipe</Link>
          <Link to="/recipes" className="text-gray-600 hover:text-black">A–Z Recipes</Link>
          <Link to="/submit" className="text-gray-600 hover:text-black">Submit</Link>
          <Link to="/about" className="text-gray-600 hover:text-black">About</Link>
          {user && <Link to="/cookbook">My Cookbook</Link>}
          {user && <Link to="/moderate">Moderate</Link>}
        </div>

        <div className="text-sm text-gray-600 space-x-2">
          {user ? (
            <>
              <span>{user?.user_metadata?.name || user?.email}</span>
              <button onClick={handleLogout} className="underline text-red-600">Log out</button>
            </>
          ) : (
            <Link to="/login" className="underline text-blue-600">Log in</Link>
          )}
        </div>
      </nav>

      <main className="p-4">{children}</main>
    </div>
  );
}
