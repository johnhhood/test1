import { Link } from 'react-router-dom';
import { useSession } from '../lib/SessionContext';
import { supabase } from '../lib/supabaseClient';

export default function Layout({ children }) {
  const { user } = useSession();

  const handleLogin = async () => {
    const email = prompt("Enter your email to log in:");
    if (email) {
      const { error } = await supabase.auth.signInWithOtp({ email });
      if (!error) alert("Check your email for a magic login link!");
      else alert("Login failed: " + error.message);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  return (
    <div>
      <nav className="bg-gray-100 border-b p-4 flex justify-between items-center">
        <div className="space-x-4">
          <Link to="/" className="font-bold">Jump to Recipe</Link>
          <Link to="/recipes">A–Z Recipes</Link>
          <Link to="/submit">Submit</Link>
          {user && <Link to="/cookbook">My Cookbook</Link>}
          {user && <Link to="/moderate">Moderate</Link>}
        </div>
        <div className="text-sm text-gray-600 space-x-2">
          {user ? (
            <>
              <span>{user.email}</span>
              <button onClick={handleLogout} className="underline text-red-600">Log out</button>
            </>
          ) : (
            <button onClick={handleLogin} className="underline text-blue-600">Log in</button>
          )}
        </div>
      </nav>
      <main className="p-4">{children}</main>
    </div>
  );
}
