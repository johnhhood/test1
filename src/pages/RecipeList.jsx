export default function RecipeList({ recipes }) {
  return (
    <div className="recipe-list">
      {recipes.map(r => (
        <div key={r.id} className="recipe-card">
          <h2 className="recipe-title">{r.title}</h2>
          <p className="cook-time">{r.cook_time}</p>
        </div>
      ))}
    </div>
  );
}