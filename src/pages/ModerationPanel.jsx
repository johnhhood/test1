
import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import { useSession } from '../lib/SessionContext';

export default function ModerationPanel() {
  const { user } = useSession();
  const [recipes, setRecipes] = useState([]);

  useEffect(() => {
    if (!user) return;
    const fetchUnapproved = async () => {
      const { data } = await supabase
        .from('recipes')
        .select('*')
        .eq('is_approved', false);
      setRecipes(data || []);
    };

    fetchUnapproved();
  }, [user]);

  const approve = async (id) => {
    await supabase.from('recipes').update({ is_approved: true }).eq('id', id);
    setRecipes(recipes.filter(r => r.id !== id));
  };

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Moderation Panel</h1>
      {recipes.length === 0 ? (
        <p className="text-gray-600">No recipes pending approval.</p>
      ) : (
        <ul className="space-y-4">
          {recipes.map(recipe => (
            <li key={recipe.id} className="border p-4 rounded shadow-sm">
              <h2 className="text-lg font-semibold mb-1">{recipe.title}</h2>
              <p className="text-sm text-gray-600 mb-2">{recipe.tags?.join(', ')}</p>
              <button
                onClick={() => approve(recipe.id)}
                className="bg-green-600 text-white px-4 py-1 rounded hover:bg-green-700"
              >
                Approve
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
