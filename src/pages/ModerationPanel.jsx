import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient';

export default function ModerationPanel() {
  const [recipes, setRecipes] = useState([]);

  const load = async () => {
    const { data } = await supabase.from('recipes').select('*').eq('is_approved', false);
    setRecipes(data);
  };

  const approve = async id => {
    await supabase.from('recipes').update({ is_approved: true }).eq('id', id);
    load();
  };

  const remove = async id => {
    await supabase.from('recipes').delete().eq('id', id);
    load();
  };

  useEffect(() => { load(); }, []);

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Pending Recipes</h2>
      <ul className="space-y-4">
        {recipes.map(r => (
          <li key={r.id} className="border p-4">
            <h3 className="text-lg font-semibold">{r.title}</h3>
            <button onClick={() => approve(r.id)} className="text-green-600 mr-4">Approve</button>
            <button onClick={() => remove(r.id)} className="text-red-600">Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
}
