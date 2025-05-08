import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';

export default function RecipeDetail() {
  const { id } = useParams();
  const [recipe, setRecipe] = useState(null);

  useEffect(() => {
    const fetchAndIncrement = async () => {
      const { data, error } = await supabase
        .from('recipes')
        .select('*')
        .eq('id', id)
        .single();

      if (error) {
        console.error('Error fetching recipe:', error.message);
        return;
      }

      setRecipe(data);

      // Increment view_count
      const { error: updateError } = await supabase
        .from('recipes')
        .update({ view_count: (data.view_count || 0) + 1 })
        .eq('id', id);

      if (updateError) {
        console.error('Error incrementing view count:', updateError.message);
      }
    };

    fetchAndIncrement();
  }, [id]);

  if (!recipe) return <p>Loading recipe...</p>;

  return (
    <div className="recipe-detail">
      <h1>{recipe.title}</h1>

      {recipe.image_url && (
        <img
          src={recipe.image_url}
          alt={recipe.title}
          className="recipe-image"
        />
      )}

      <p>Cook Time: {recipe.cook_time}</p>

      {Array.isArray(recipe.tags) && (
        <p>Tags: {recipe.tags.join(', ')}</p>
      )}

      {Array.isArray(recipe.ingredients) ? (
        <div>
          <h2>Ingredients:</h2>
          <ul>
            {Array.isArray(recipe.ingredients) && recipe.ingredients.map((item, i) => (
              <li key={i}>{item}</li>
            ))}
          </ul>
        </div>
      ) : (
        <p>Ingredients: {recipe.ingredients}</p>
      )}

      {Array.isArray(recipe.steps) ? (
        <div>
          <h2>Steps:</h2>
          <ol>
            {Array.isArray(recipe.steps) && recipe.steps.map((item, i) => (
              <li key={i}>{step}</li>
            ))}
          </ol>
        </div>
      ) : (
        <p>Steps: {recipe.steps}</p>
      )}
    </div>
  );
}
