
import {{ useEffect, useState }} from 'react';
import {{ useParams }} from 'react-router-dom';
import {{ supabase }} from '../lib/supabaseClient';
import {{ useSession }} from '../lib/SessionContext';

export default function RecipeDetail() {{
  const {{ id }} = useParams();
  const {{ user }} = useSession();
  const [recipe, setRecipe] = useState(null);

  useEffect(() => {{
    const fetchRecipe = async () => {{
      const {{ data }} = await supabase.from('recipes').select('*').eq('id', id).single();
      setRecipe(data);
    }};
    fetchRecipe();
  }}, [id]);

  if (!recipe) return <p className="p-4">Loading recipe...</p>;

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-2">{{recipe.title}}</h1>
      {{recipe.image_url && (
        <img src={{recipe.image_url}} alt={{recipe.title}} className="w-full h-64 object-cover rounded mb-4" />
      )}}
      {{recipe.tags?.length > 0 && (
        <p className="text-sm text-gray-600 mb-4">Tags: {{recipe.tags.join(', ')}}</p>
      )}}
      <div className="mb-4">
        <p><strong>Cook Time:</strong> {{recipe.cook_time}}</p>
        <p><strong>Servings:</strong> {{recipe.servings}}</p>
      </div>
      <div className="mb-4">
        <h2 className="text-lg font-semibold">Ingredients</h2>
        <ul className="list-disc list-inside">
          {{recipe.ingredients?.split('\n').map((line, i) => <li key={{i}}>{{line}}</li>)}}
        </ul>
      </div>
      <div className="mb-4">
        <h2 className="text-lg font-semibold">Steps</h2>
        <ol className="list-decimal list-inside space-y-1">
          {{recipe.steps?.split('\n').map((step, i) => <li key={{i}}>{{step}}</li>)}}
        </ol>
      </div>
    </div>
  );
}}
