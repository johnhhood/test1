
import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import { Link } from 'react-router-dom';

export default function Home() {
  const [recipes, setRecipes] = useState([]);

  useEffect(() => {
    const fetchPopular = async () => {
      const { data, error } = await supabase
        .from('recipes')
        .select('*')
        .eq('is_approved', true)
        .order('view_count', { ascending: false })
        .limit(6);

      if (!error) setRecipes(data);
    };

    fetchPopular();
  }, []);

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Popular Recipes</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {recipes.map(recipe => (
          <Link to={`/recipes/${recipe.id}`} key={recipe.id} className="border rounded shadow hover:shadow-md transition block">
            {recipe.image_url && (
              <img src={recipe.image_url} alt={recipe.title} className="w-full h-48 object-cover rounded-t" />
            )}
            <div className="p-4">
              <h2 className="text-lg font-semibold">{recipe.title}</h2>
              {recipe.tags && (
                <p className="text-sm text-gray-500">{recipe.tags.join(', ')}</p>
              )}
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
