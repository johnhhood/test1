import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';

export default function Home() {
  const [recipes, setRecipes] = useState([]);

  useEffect(() => {
    const loadPopular = async () => {
      const { data, error } = await supabase
        .from('recipes')
        .select('*')
        .eq('is_approved', true)
        .order('view_count', { ascending: false })
        .limit(10);

      if (!error) setRecipes(data);
    };
    loadPopular();
  }, []);

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Popular Recipes</h2>
      <ul className="grid gap-4">
        {recipes.map(r => (
          <li key={r.id} className="border p-4">
            <Link to={`/recipes/${r.id}`} className="block hover:underline">
              <h3 className="text-lg font-semibold">{r.title}</h3>
              {r.tags && <p className="text-sm text-gray-600">Tags: {r.tags.join(', ')}</p>}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
