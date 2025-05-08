import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient';

export default function Home() {
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRecipes = async () => {
      const { data, error } = await supabase
        .from('recipes')
        .select('*')
        .order('view_count', { ascending: false })
        .limit(5);

      if (error) {
        console.error("Error fetching recipes:", error.message);
      } else {
        setRecipes(data);
      }
      setLoading(false);
    };

    fetchRecipes();
  }, []);

  if (loading) return <div>Loading recipes...</div>;

  return (
    <div style={{ background: 'lightyellow', padding: '2rem' }}>
      <h2>✅ Recipes Loaded</h2>
      {Array.isArray(recipes) && recipes.length > 0 ? (
        <ul>
          {recipes.map(r => (
            <li key={r.id}>{r.title}</li>
          ))}
        </ul>
      ) : (
        <p>No recipes found.</p>
      )}
    </div>
  );
}
