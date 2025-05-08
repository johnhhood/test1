import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';

export default function RecipeDetail() {
  const { id } = useParams();
  const [recipe, setRecipe] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAndIncrement = async () => {
      const { data, error } = await supabase
        .from('recipes')
        .select('*')
        .eq('id', id)
        .single();

      if (error) {
        console.error('Error fetching recipe:', error.message);
        setLoading(false);
        return;
      }

      setRecipe(data);

      // Increment view count
      await supabase
        .from('recipes')
        .update({ view_count: (data.view_count || 0) + 1 })
        .eq('id', id);

      setLoading(false);
    };

    fetchAndIncrement();
  }, [id]);

  if (loading) return <p>Loading recipe...</p>;
  if (!recipe) return <p>Recipe not found.</p>;

  return (
    <div className="recipe-detail" style={{ padding: 40 }}>
      <h1>{recipe.title}</h1>

      {recipe.image_url && (
        <img
          src={recipe.image_url}
          alt={recipe.title}
          style={{ width: '100%', maxWidth: 600, marginBottom: 20 }}
        />
      )}

      <p>Cook Time: {recipe.cook_time}</p>
      <p>Servings: {recipe.servings}</p>

      {Array.isArray(recipe.tags) && recipe.tags.length > 0 && (
        <p><strong>Tags:</strong> {recipe.tags.join(', ')}</p>
      )}

      {Array.isArray(recipe.ingredients) ? (
        <>
          <h2>Ingredients</h2>
          <ul>
            {recipe.ingredients.map((item, i) => <li key={i}>{item}</li>)}
          </ul>
        </>
      ) : (
        <p>Ingredients: {recipe.ingredients}</p>
      )}

      {Array.isArray(recipe.steps) ? (
        <>
          <h2>Steps</h2>
          <ol>
            {recipe.steps.map((step, i) => <li key={i}>{step}</li>)}
          </ol>
        </>
      ) : (
        <p>Steps: {recipe.steps}</p>
      )}
    </div>
  );
}
