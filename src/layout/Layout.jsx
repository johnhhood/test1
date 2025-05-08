import { Link, Outlet } from 'react-router-dom';
import { useSession } from '../lib/SessionContext';
import { supabase } from '../lib/supabaseClient';

export default function Layout() {
  const { user, loading } = useSession();

  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  if (loading) return <p>Loading session...</p>;

  return (
    <div className="layout" style={{ display: 'flex', minHeight: '100vh' }}>
      {/* Sidebar */}
      <aside
        className="sidebar"
        style={{
          width: 250,
          background: '#c0c0c0',
          padding: '1rem',
          borderRight: '2px solid black',
        }}
      >
        <nav style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <Link to="/">🏠 Home</Link>
          <Link to="/recipes">📖 A–Z Recipes</Link>
          <Link to="/submit">📝 Submit</Link>
          <Link to="/about">📜 About</Link>
          {user && <Link to="/cookbook">📚 My Cookbook</Link>}
          {user && <Link to="/moderate">🛠 Moderate</Link>}
        </nav>
        <div style={{ marginTop: '2rem', fontSize: '0.9rem' }}>
          {user ? (
            <>
              <p>Logged in as <strong>{user.email}</strong></p>
              <button onClick={handleLogout}>Log out</button>
            </>
          ) : (
            <Link to="/login">Log in</Link>
          )}
        </div>
      </aside>

      {/* Main Content */}
      <main className="main-content" style={{ flex: 1, padding: '2rem' }}>
        <Outlet />
      </main>
    </div>
  );
}
