import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import { Link } from 'react-router-dom';
import React from 'react';
import RecipeList from './RecipeList';

export default function Home() {
  const [popularRecipes, setPopularRecipes] = useState([]);

  useEffect(() => {
    const fetchPopular = async () => {
      const { data, error } = await supabase
        .from('recipes')
        .select('*')
        .eq('is_approved', true)
        .gte('views', 0)
        .order('views', { ascending: false })

      if (!error) setPopularRecipes(data);
    };

    fetchPopular();
  }, []);

  return (
    <div className="home">
      <h1 className="home-title">Popular Recipes</h1>
      <div className="popular-grid">
        {popularRecipes.map(recipe => (
          <Link to={`/recipes/${recipe.id}`} key={recipe.id} className="recipe-card">
            {recipe.image_url && (
              <img
                src={recipe.image_url}
                alt={recipe.title}
                className="recipe-image"
              />
            )}
            <div className="recipe-card-content">
              <h2 className="recipe-title">{recipe.title}</h2>
              <p className="cook-time">⏱ {recipe.cook_time}</p>
              <p className="tags">Tags: {recipe.tags?.join(', ')}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
