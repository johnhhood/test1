import { Outlet } from 'react-router-dom';
import { useSession } from '../lib/SessionContext';

export default function Layout() {
  const { user, loading } = useSession();
  console.log("Session loaded:", { user, loading });

  return (
    <div style={{ border: '2px solid black', padding: '2rem' }}>
      <h1>✅ Layout Loaded</h1>
      {user && <p>Welcome, {user.email || user.id}</p>}
      <Outlet />
    </div>
  );
}
