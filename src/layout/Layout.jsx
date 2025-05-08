import { Link } from 'react-router-dom';
import { useSession } from '../lib/SessionContext';
import { supabase } from '../lib/supabaseClient';
import { Outlet } from 'react-router-dom';

export default function Layout() {
  return (
    <div className="layout">
      <aside className="sidebar">
        <nav>
          <a href="/">Home</a>
          <a href="/recipes">Recipes</a>
          <a href="/about">About</a>
        </nav>
      </aside>
      <main className="main-content">
        <header className="site-header">
          <img src="/logo-banner.png" alt="Jump to Recipe Logo" className="logo-banner" />
        </header>
        <Outlet />
      </main>
    </div>
  );
}

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

        <main>{children}</main>
      </div>
    </div>
  );
}
