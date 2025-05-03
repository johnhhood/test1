import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';
import { useSession } from '../lib/SessionContext';

export default function RecipeDetail() {
  const { id } = useParams();
  const { user } = useSession();
  const [recipe, setRecipe] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [form, setForm] = useState(null);

  // ✅ Replace this with your actual moderator email
  const isModerator = user?.email === 'johnhood2013@gmail.com';

  useEffect(() => {
    const fetchRecipe = async () => {
      const { data } = await supabase.from('recipes').select('*').eq('id', id).single();
      setRecipe(data);
      setForm(data); // pre-fill edit form
    };
    fetchRecipe();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(f => ({ ...f, [name]: value }));
  };

  const handleImageUpload = async (file) => {
    const fileName = `${Date.now()}_${file.name}`;
    const { error } = await supabase.storage
      .from('recipe-images')
      .upload(fileName, file);

    if (error) {
      console.error("Upload error:", error);
      return null;
    }

    const { publicUrl } = supabase.storage
      .from('recipe-images')
      .getPublicUrl(fileName).data;

    return publicUrl;
  };

  const handleSave = async () => {
    const { error } = await supabase
      .from('recipes')
      .update({
        title: form.title,
        ingredients: form.ingredients,
        steps: form.steps,
        cook_time: form.cook_time,
        servings: form.servings,
        tags: form.tags.split(',').map(t => t.trim()),
        image_url: form.image_url
      })
      .eq('id', id);

    if (error) {
        console.error("Save failed:", error);
        alert("Save failed: " + error.message);
    } else {
        alert("Changes saved!");
        setRecipe(form);
        setEditMode(false);
    }

      console.error("Save failed:", error);
    }
  };

  if (!recipe) return <p className="p-4">Loading recipe...</p>;

  return (
    <div className="max-w-3xl mx-auto p-6">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">
          {editMode ? (
            <input name="title" value={form.title} onChange={handleChange} className="w-full border p-1" />
          ) : (
            recipe.title
          )}
        </h1>
        {isModerator && (
          <button onClick={() => setEditMode(!editMode)} className="text-blue-600 underline">
            {editMode ? 'Cancel' : 'Edit'}
          </button>
        )}
      </div>

      {editMode && (
        <input type="file" onChange={async (e) => {
          const file = e.target.files[0];
          if (file) {
            const url = await handleImageUpload(file);
            if (url) setForm(f => ({ ...f, image_url: url }));
          }
        }} />
      )}

      {form?.image_url && (
        <img src={form.image_url} alt={form.title} className="w-full h-64 object-cover rounded mb-4" />
      )}

      {editMode && <p className="text-xs mb-4">Image preview — upload new to replace</p>}

      {!editMode && recipe.tags?.length > 0 && (
        <p className="text-sm text-gray-600 mb-4">Tags: {recipe.tags.join(', ')}</p>
      )}

      {editMode && (
        <input
          name="tags"
          value={form.tags}
          onChange={handleChange}
          placeholder="comma-separated tags"
          className="w-full border p-1 mb-4"
        />
      )}

      <div className="mb-4">
        {editMode ? (
          <>
            <input name="cook_time" value={form.cook_time} onChange={handleChange} className="w-full border p-1 mb-2" />
            <input name="servings" value={form.servings} onChange={handleChange} className="w-full border p-1 mb-2" />
          </>
        ) : (
          <>
            <p><strong>Cook Time:</strong> {recipe.cook_time}</p>
            <p><strong>Servings:</strong> {recipe.servings}</p>
          </>
        )}
      </div>

      <div className="mb-4">
        <h2 className="text-lg font-semibold">Ingredients</h2>
        {editMode ? (
          <textarea
            name="ingredients"
            value={form.ingredients}
            onChange={handleChange}
            className="w-full border p-2"
            rows={4}
          />
        ) : (
          <ul className="list-disc list-inside">
            {recipe.ingredients?.split('\n').map((line, i) => <li key={i}>{line}</li>)}
          </ul>
        )}
      </div>

      <div className="mb-4">
        <h2 className="text-lg font-semibold">Steps</h2>
        {editMode ? (
          <textarea
            name="steps"
            value={form.steps}
            onChange={handleChange}
            className="w-full border p-2"
            rows={4}
          />
        ) : (
          <ol className="list-decimal list-inside space-y-1">
            {recipe.steps?.split('\n').map((step, i) => <li key={i}>{step}</li>)}
          </ol>
        )}
      </div>

      {editMode && (
        <button onClick={handleSave} className="bg-black text-white px-4 py-2 rounded hover:bg-gray-800">
          Save Changes
        </button>
      )}
    </div>
  );
}
