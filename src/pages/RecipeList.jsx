import { Link } from 'react-router-dom';

export default function RecipeList({ recipes = [] }) {
  if (!recipes.length) return <p>No recipes found.</p>;

  return (
    <div className="recipe-list">
      {Array.isArray(popularRecipes) && popularRecipes.map(...)}
        <Link to={`/recipes/${r.id}`} key={r.id} className="recipe-card">
          {r.image_url && (
            <img src={r.image_url} alt={r.title} className="recipe-image" />
          )}
          <div className="recipe-card-content">
            <h2 className="recipe-title">{r.title}</h2>
            <p className="cook-time">⏱ {r.cook_time}</p>
            {Array.isArray(recipe.tags) && (
              <p>Tags: {recipe.tags.join(', ')}</p>
            )}
            )}
          </div>
        </Link>
      ))}
    </div>
  );
}
