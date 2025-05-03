import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';

export default function RecipeList() {
  const [recipes, setRecipes] = useState([]);
  const [search, setSearch] = useState('');
  const [activeTag, setActiveTag] = useState('');

  useEffect(() => {
    const fetchRecipes = async () => {
      const { data, error } = await supabase
        .from('recipes')
        .select('*')
        .eq('is_approved', true)
        .order('title', { ascending: true });

      if (!error) {
        setRecipes(data);
      }
    };
    fetchRecipes();
  }, []);

  const allTags = Array.from(new Set(recipes.flatMap(r => r.tags || [])));

  const filtered = recipes.filter(recipe => {
    const text = `${recipe.title} ${recipe.ingredients} ${recipe.tags?.join(' ')}`.toLowerCase();
    const matchesSearch = text.includes(search.toLowerCase());
    const matchesTag = activeTag ? recipe.tags?.includes(activeTag) : true;
    return matchesSearch && matchesTag;
  });

  const clearFilters = () => {
    setSearch('');
    setActiveTag('');
  };

  return (
    <div className="max-w-4xl mx-auto">
      <h2 className="text-xl font-bold mb-4">All Recipes A–Z</h2>
      <input
        type="text"
        placeholder="Search by name, ingredient, or tag..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="w-full mb-4 border p-2"
      />
      <div className="flex flex-wrap gap-2 mb-4">
        {allTags.map(tag => (
          <button
            key={tag}
            onClick={() => setActiveTag(tag === activeTag ? '' : tag)}
            className={`px-2 py-1 border text-sm ${tag === activeTag ? 'bg-black text-white' : 'bg-gray-100'}`}
          >
            {tag}
          </button>
        ))}
        {(search || activeTag) && (
          <button
            onClick={clearFilters}
            className="px-2 py-1 border bg-red-100 text-red-700 text-sm"
          >
            Clear Filters
          </button>
        )}
      </div>
      {filtered.length === 0 ? (
        <p>No matching recipes found.</p>
      ) : (
        <ul className="space-y-4">
          {filtered.map(recipe => (
            <li key={recipe.id} className="border p-4">
              <Link to={`/recipes/${recipe.id}`} className="block hover:underline">
                <h3 className="text-lg font-semibold">{recipe.title}</h3>
                {recipe.tags?.length > 0 && (
                  <p className="text-sm text-gray-600">Tags: {recipe.tags.join(', ')}</p>
                )}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
