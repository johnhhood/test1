import { Link, Outlet } from 'react-router-dom';
import { useSession } from '../lib/SessionContext';
import { supabase } from '../lib/supabaseClient';

export default function Layout() {
  const { user } = useSession();

  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  return (
    <div className="layout">
      {/* Sidebar */}
      <aside className="sidebar">
        <nav>
          <Link to="/">🏠 Home</Link>
          <Link to="/recipes">📖 A–Z Recipes</Link>
          <Link to="/submit">📝 Submit</Link>
          <Link to="/about">📜 About</Link>
          {user && <Link to="/cookbook">📚 My Cookbook</Link>}
          {user && <Link to="/moderate">🛠 Moderate</Link>}
        </nav>
      </aside>

      {/* Main content area */}
      <div className="main-content">
        {/* Logo banner */}
        <header className="site-header">
          <img src="/logo-banner.png" alt="Jump to Recipe Logo" className="logo-banner" />
        </header>

        {/* Auth status and title */}
        <header className="header">
          <div className="site-title">Jump to Recipe</div>
          <div className="user-status">
            {user ? (
              <>
                <span>{user?.user_metadata?.name || user?.email}</span>
                <button onClick={handleLogout} className="logout-button">
                  Log out
                </button>
              </>
            ) : (
              <Link to="/login" className="login-link">Log in</Link>
            )}
          </div>
        </header>

        {/* Page content */}
        <main>
          <Outlet />
        </main>
      </div>
    </div>
  );
}
