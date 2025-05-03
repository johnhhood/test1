import { Routes, Route } from 'react-router-dom';
import Layout from './layout/Layout';
import Home from './pages/Home';
import RecipeList from './pages/RecipeList';
import RecipeDetail from './pages/RecipeDetail';
import SubmitRecipe from './pages/SubmitRecipe';
import ModerationPanel from './pages/ModerationPanel';
import Cookbook from './pages/Cookbook';
import Login from './pages/Login';

export default function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/recipes" element={<RecipeList />} />
        <Route path="/recipes/:id" element={<RecipeDetail />} />
        <Route path="/submit" element={<SubmitRecipe />} />
        <Route path="/moderate" element={<ModerationPanel />} />
        <Route path="/cookbook" element={<Cookbook />} />
        <Route path="/login" element={<Login />} />
      </Routes>
    </Layout>
  );
}
