import { createContext, useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';

export const RecipeContext = createContext();

export function RecipeProvider({ children }) {
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchRecipes() {
      const { data, error } = await supabase
        .from('recipes')
        .select('*')
        .order('title', { ascending: true });

      if (error) {
        console.error('Error fetching recipes:', error);
      } else {
        setRecipes(data);
      }

      setLoading(false);
    }

    fetchRecipes();
  }, []);

  return (
    <RecipeContext.Provider value={{ recipes, loading }}>
      {children}
    </RecipeContext.Provider>
  );
}
