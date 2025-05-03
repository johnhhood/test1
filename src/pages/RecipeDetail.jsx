export default function RecipeDetail({ recipe }) {
  if (!recipe) return <p className="loading-message">Loading...</p>;

  return (
    <div className="recipe-detail">
      <h1 className="recipe-title">{recipe.title}</h1>
      {recipe.image_url && <img src={recipe.image_url} alt={recipe.title} className="recipe-image" />}
      <div className="recipe-meta">
        <p><strong>Cook Time:</strong> {recipe.cook_time}</p>
        <p><strong>Servings:</strong> {recipe.servings}</p>
        <p><strong>Tags:</strong> {recipe.tags?.join(', ')}</p>
      </div>
      <div className="recipe-ingredients">
        <h2>Ingredients</h2>
        <ul>
          {recipe.ingredients?.split('\n').map((line, i) => <li key={i}>{line}</li>)}
        </ul>
      </div>
      <div className="recipe-steps">
        <h2>Steps</h2>
        <ol>
          {recipe.steps?.split('\n').map((step, i) => <li key={i}>{step}</li>)}
        </ol>
      </div>
    </div>
  );
}