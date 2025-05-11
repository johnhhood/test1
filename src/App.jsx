import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { RecipeProvider } from './contexts/RecipeContexts';
import Layout from './layout/Layout';
import Home from './pages/Home';
import Login from './pages/Login';
import RecipeList from './pages/RecipeList';
import SubmitRecipe from './pages/SubmitRecipe';
import About from './pages/About';
import Cookbook from './pages/Cookbook';
import ModerationPanel from './pages/ModerationPanel';
import RecipeDetail from './pages/RecipeDetail'; // ✅ Don't forget this import

export default function App() {
  return (
  <RecipeProvider>
    <Router>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="recipes" element={<RecipeList />} />
          <Route path="recipes/:id" element={<RecipeDetail />} /> {/* ✅ Add this */}
          <Route path="submit" element={<SubmitRecipe />} />
          <Route path="about" element={<About />} />
          <Route path="cookbook" element={<Cookbook />} />
          <Route path="moderate" element={<ModerationPanel />} />
        </Route>
        <Route path="/login" element={<Login />} />
      </Routes>
    </Router>
  </RecipeProvider>
  );
}
