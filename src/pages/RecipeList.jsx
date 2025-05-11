import { useContext } from 'react';
import { Link } from 'react-router-dom';
import { RecipeContext } from '../contexts/RecipeContexts';

export default function RecipeList() {
  const { recipes, loading } = useContext(RecipeContext);

  if (loading) return <p>Loading recipes...</p>;
  if (!Array.isArray(recipes) || recipes.length === 0) {
    return <p>No recipes found.</p>;
  }

  return (
    <div className="recipe-list">
      {recipes.map(r => (
        <Link to={`/recipes/${r.id}`} key={r.id} className="recipe-card">
          {r.image_url && (
            <img src={r.image_url} alt={r.title} className="recipe-image" />
          )}
          <div className="recipe-card-content">
            <h2 className="recipe-title">{r.title}</h2>
            <p className="cook-time">⏱ {r.cook_time}</p>
            {Array.isArray(r.tags) && (
              <p className="tags">Tags: {r.tags.join(', ')}</p>
            )}
          </div>
        </Link>
      ))}
    </div>
  );
}
