import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';
import { useSession } from '../lib/SessionContext';

export default function RecipeDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useSession();
  const [recipe, setRecipe] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [form, setForm] = useState(null);
  const [loading, setLoading] = useState(false);

  const isModerator = user?.email === 'johnhood2013@gmail.com'; // <-- update this

  useEffect(() => {
    const fetchRecipe = async () => {
      const { data } = await supabase.from('recipes').select('*').eq('id', id).single();
      setRecipe(data);
      setForm(data);
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
      alert("Image upload failed: " + error.message);
      return null;
    }

    const { publicUrl } = supabase.storage
      .from('recipe-images')
      .getPublicUrl(fileName).data;

    return publicUrl;
  };

  const handleSave = async () => {
    setLoading(true);
    console.log("Saving form:", form);

    const parsedTags = Array.isArray(form.tags)
      ? form.tags.map(tag => tag.trim())
      : form.tags.split(',').map(tag => tag.trim());

    const { error } = await supabase
      .from('recipes')
      .update({
        title: form.title,
        ingredients: form.ingredients,
        steps: form.steps,
        cook_time: form.cook_time,
        servings: form.servings,
        tags: parsedTags,
        image_url: form.image_url
      })
      .eq('id', id);

    setLoading(false);

    if (error) {
      console.error("Save failed:", error);
      alert("❌ Save failed: " + error.message);
    } else {
      alert("✅ Changes saved!");
      setEditMode(false);
      navigate(`/recipes/${id}`); // 🔁 redirect to refresh the detail page
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
          value={Array.isArray(form.tags) ? form.tags.join(', ') : form.tags}
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
            {recipe.ingredients?.split('\n').
