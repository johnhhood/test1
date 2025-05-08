import { Outlet } from 'react-router-dom';

export default function Layout() {
  return (
    <div style={{ border: '2px solid black', padding: '2rem' }}>
      <h1>✅ Layout Loaded</h1>
      <Outlet />
    </div>
  );
}
