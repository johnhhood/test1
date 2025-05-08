import { Outlet, Link } from 'react-router-dom';
import { useSession } from '../lib/SessionContext';
import { supabase } from '../lib/supabaseClient';

export default function Layout() {
  const { user, loading } = useSession();

  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  return (
    <div style={{ border: '2px solid black', padding: '2rem' }}>
      <h1>✅ Layout Loaded</h1>
      
      {user ? (
        <>
          <p>Welcome, {user.email}</p>
          <button onClick={handleLogout}>Log out</button>
        </>
      ) : (
        <p><Link to="/login">Log in</Link></p>
      )}

      <Outlet />
    </div>
  );
}
