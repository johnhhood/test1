import { useContext } from 'react';
import { Link } from 'react-router-dom';
import { RecipeContext } from '../contexts/RecipeContexts';

export default function Home() {
  const { recipes, loading } = useContext(RecipeContext);

  if (loading) return <p>Loading...</p>;

  // Show only top 6 approved recipes, sorted by view_count descending
  const popularRecipes = recipes
    .filter(r => r.is_approved)
    .sort((a, b) => b.view_count - a.view_count)
    .slice(0, 6);

  return (
    <div className="home" style={{ padding: 40 }}>
      <h1>Popular Recipes</h1>
      <div className="popular-grid" style={{ display: 'grid', gap: '1.5rem' }}>
        {popularRecipes.length > 0 ? (
          popularRecipes.map(recipe => (
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
