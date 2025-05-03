import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import { useSession } from '../lib/SessionContext';

export default function Cookbook() {
  const { user } = useSession();
  const [recipes, setRecipes] = useState([]);

  useEffect(() => {
    const load = async () => {
      if (!user) return;
      const { data } = await supabase.from('cookbook_recipes')
        .select('recipe:recipe_id(*)')
        .eq('user_id', user.id);
      setRecipes(data.map(entry => entry.recipe));
    };
    load();
  }, [user]);

  const remove = async (id) => {
    await supabase.from('cookbook_recipes').delete().match({ user_id: user.id, recipe_id: id });
    setRecipes(prev => prev.filter(r => r.id !== id));
  };

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">My Cookbook</h2>
      <ul className="space-y-4">
        {recipes.map(r => (
          <li key={r.id} className="border p-4">
            <h3 className="text-lg font-semibold">{r.title}</h3>
            <button onClick={() => remove(r.id)} className="text-red-600">Remove</button>
          </li>
        ))}
      </ul>
    </div>
  );
}
