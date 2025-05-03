
import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import { useSession } from '../lib/SessionContext';
import { Link } from 'react-router-dom';

export default function Cookbook() {
  const { user } = useSession();
  const [recipes, setRecipes] = useState([]);

  useEffect(() => {
    if (!user) return;
    const fetchCookbook = async () => {
      const { data, error } = await supabase
        .from('cookbook_recipes')
        .select('recipe_id, recipes(*)')
        .eq('user_id', user.id);

      if (!error) {
        const cleaned = data.map(entry => entry.recipes);
        setRecipes(cleaned);
      }
    };

    fetchCookbook();
  }, [user]);

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">My Cookbook</h1>
      {recipes.length === 0 ? (
        <p className="text-gray-600">No saved recipes yet.</p>
      ) : (
        <div className="space-y-4">
          {recipes.map(recipe => (
            <Link key={recipe.id} to={`/recipes/${recipe.id}`} className="block border rounded p-4 hover:shadow transition">
              <h2 className="text-lg font-semibold">{recipe.title}</h2>
              <p className="text-sm text-gray-500">{recipe.tags?.join(', ')}</p>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
