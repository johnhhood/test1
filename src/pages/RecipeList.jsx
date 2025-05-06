import { Link } from 'react-router-dom';

export default function RecipeList({ recipes }) {
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
            {r.tags?.length > 0 && (
              <p className="tags">Tags: {r.tags.join(', ')}</p>
            )}
          </div>
        </Link>
      ))}
    </div>
  );
}
