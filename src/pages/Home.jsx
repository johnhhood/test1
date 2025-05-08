import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import { Link } from 'react-router-dom';

export default function Home() {
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRecipes = async () => {
      const { data, error } = await supabase
        .from('recipes')
        .select('*')
        .eq('is_approved', true)
        .order('view_count', { ascending: false })
        .limit(6);

      if (error) {
        console.error("Error fetching recipes:", error.message);
      } else {
        setRecipes(data);
      }

      setLoading(false);
    };

    fetchRecipes();
  }, []);

  if (loading) return <p>Loading...</p>;

  return (
    <div className="home" style={{ padding: 40 }}>
      <h1>Popular Recipes</h1>
      <div className="popular-grid" style={{ display: 'grid', gap: '1.5rem' }}>
        {Array.isArray(recipes) && recipes.length > 0 ? (
          recipes.map(recipe => (
            <Link
              to={`/recipes/${recipe.id}`}
              key={recipe.id}
              className="recipe-card"
              style={{
                display: 'block',
                border: '1px solid #ccc',
                padding: 20,
                textDecoration: 'none',
                color: 'inherit',
              }}
            >
              {recipe.image_url && (
                <img
                  src={recipe.image_url}
                  alt={recipe.title}
                  style={{ width: '100%', height: 'auto', marginBottom: 10 }}
                />
              )}
              <h2>{recipe.title}</h2>
              <p>⏱ {recipe.cook_time}</p>
              {Array.isArray(recipe.tags) && recipe.tags.length > 0 && (
                <p><em>Tags: {recipe.tags.join(', ')}</em></p>
              )}
            </Link>
          ))
        ) : (
          <p>No recipes found.</p>
        )}
      </div>
    </div>
  );
}
