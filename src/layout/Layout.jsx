import { Link } from 'react-router-dom';

export default function Layout() {
  console.log("Layout is rendering");

  return (
    <div style={{ padding: '2rem', fontFamily: 'Comic Sans MS', fontSize: '1.5rem' }}>
      <h1>Hello from Layout</h1>
      <nav>
        <Link to="/">🏠 Home</Link>
      </nav>
    </div>
  );
}
