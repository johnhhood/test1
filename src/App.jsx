import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { supabase } from './lib/supabaseClient';
import Layout from './layout/Layout';
import Home from './pages/Home';
import RecipeList from './pages/RecipeList';
import RecipeDetail from './pages/RecipeDetail';
import SubmitRecipe from './pages/SubmitRecipe';
import ModerationPanel from './pages/ModerationPanel';
import Cookbook from './pages/Cookbook';
import AuthForm from './pages/AuthForm';
import ResetPassword from './pages/ResetPassword';
import About from './pages/About';
import Submitted from './pages/Submitted';

export default function App() {
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchRecipes() {
      const { data, error } = await supabase.from('recipes').select('*');
      if (error) {
        console.error('Error fetching recipes:', error.message);
      } else {
        setRecipes(data);
      }
      setLoading(false);
    }
    fetchRecipes();
  }, []);

  if (loading) return <p>Loading site...</p>;

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home recipes={recipes} />} />
          <Route path="recipes" element={<RecipeList recipes={recipes} />} />
          <Route path="recipes/:id" element={<RecipeDetail />} />
          <Route path="submit" element={<SubmitRecipe />} />
          <Route path="moderate" element={<ModerationPanel />} />
          <Route path="cookbook" element={<Cookbook />} />
          <Route path="about" element={<About />} />
          <Route path="submitted" element={<Submitted />} />
          <Route path="/login" element={<AuthForm />} />
          <Route path="/reset" element={<ResetPassword />} />
      </Routes>
    </BrowserRouter>
  );
}
