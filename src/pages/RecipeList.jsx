
import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import { Link } from 'react-router-dom';

export default function RecipeList() {
  const [recipes, setRecipes] = useState([]);
  const [query, setQuery] = useState('');

  useEffect(() => {
    const fetchRecipes = async () => {
      const { data } = await supabase
        .from('recipes')
        .select('*')
        .eq('is_approved', true)
        .order('title');
      setRecipes(data);
    };

    fetchRecipes();
  }, []);

  const filtered = recipes.filter(r =>
    r.title.toLowerCase().includes(query.toLowerCase()) ||
    r.tags?.some(tag => tag.toLowerCase().includes(query.toLowerCase()))
  );

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Browse Recipes A–Z</h1>
      <input
        type="text"
        value={query}
        onChange={e => setQuery(e.target.value)}
        placeholder="Search by title or tag..."
        className="w-full border p-2 rounded mb-6"
      />
      <div className="space-y-4">
        {filtered.map(recipe => (
          <Link key={recipe.id} to={`/recipes/${recipe.id}`} className="block border rounded p-4 hover:shadow transition">
            <h2 className="text-lg font-semibold">{recipe.title}</h2>
            <p className="text-sm text-gray-500">{recipe.tags?.join(', ')}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
