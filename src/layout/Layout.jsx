import { Link } from 'react-router-dom';
import { useSession } from '../lib/SessionContext';

export default function Layout({ children }) {
  const { user } = useSession();

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
        <div className="text-sm text-gray-600">
          {user ? `Logged in as ${user.email}` : 'Not logged in'}
        </div>
      </nav>
      <main className="p-4">{children}</main>
    </div>
  );
}
