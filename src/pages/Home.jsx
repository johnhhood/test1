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
    <div className="max-w-3xl mx-auto p-4">
  <h1 className="text-2xl font-bold mb-6">Popular Recipes</h1>
  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
    {recipes.map(recipe => (
      <div key={recipe.id} className="border rounded shadow-sm hover:shadow-md transition">
        {recipe.image_url && (
          <img src={recipe.image_url} alt={recipe.title} className="w-full h-48 object-cover rounded-t" />
        )}
        <div className="p-4">
          <h2 className="text-lg font-semibold mb-1">{recipe.title}</h2>
          <p className="text-sm text-gray-500">{recipe.tags?.join(', ')}</p>
        </div>
      </div>
    ))}
  </div>
</div>
  );
}
