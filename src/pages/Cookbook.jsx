import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import { useSession } from '../lib/SessionContext';
import { Link } from 'react-router-dom';

export default function Cookbook() {
  const { user } = useSession();
  const [recipes, setRecipes] = useState([]);

  useEffect(() => {
    if (!user) return;
    const fetchCookbook = async () => {
      const { data, error } = await supabase
        .from('cookbook_recipes')
        .select('recipe_id, recipes(*)')
        .eq('user_id', user.id);

      if (!error) {
        const cleaned = data.map(entry => entry.recipes);
        setRecipes(cleaned);
      }
    };

    fetchCookbook();
  }, [user]);

  return (
    <div className="cookbook-container">
      <h1 className="cookbook-title">My Cookbook</h1>
      {recipes.length === 0 ? (
        <p className="cookbook-empty">No saved recipes yet.</p>
      ) : (
        <div className="cookbook-grid">
          {recipes.map(recipe => (
            <Link key={recipe.id} to={`/recipes/${recipe.id}`} className="cookbook-card">
              <h2 className="recipe-title">{recipe.title}</h2>
              <p className="tags">{recipe.tags?.join(', ')}</p>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
