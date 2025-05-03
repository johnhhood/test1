
import { useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import { useSession } from '../lib/SessionContext';

export default function SubmitRecipe() {
  const { user } = useSession();
  const [form, setForm] = useState({
    title: '',
    ingredients: '',
    steps: '',
    cook_time: '',
    servings: '',
    tags: '',
    image_url: ''
  });
  const [message, setMessage] = useState('');

  const handleChange = e => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleImageUpload = async (file) => {
    const fileName = `${Date.now()}_${file.name}`;
    const { data, error } = await supabase.storage
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

  const handleSubmit = async e => {
    e.preventDefault();
    if (!user) return alert("Please log in to submit a recipe.");

    const { error } = await supabase.from('recipes').insert([{
      ...form,
      author_id: user.id,
      tags: form.tags.split(',').map(tag => tag.trim()),
      is_approved: false
    }]);

    if (error) {
      console.error(error);
      setMessage('❌ Failed to submit: ' + error.message);
    } else {
      setMessage('✅ Recipe submitted for review!');
      setForm({
        title: '',
        ingredients: '',
        steps: '',
        cook_time: '',
        servings: '',
        tags: '',
        image_url: ''
      });
    }
  };

  return (
    <div className="max-w-lg mx-auto p-6 bg-white border rounded shadow">
      <h2 className="text-xl font-bold mb-4">Submit a Recipe</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        {['title', 'cook_time', 'servings', 'tags'].map(field => (
          <div key={field}>
            <label className="block text-sm font-medium mb-1 capitalize">{field.replace('_', ' ')}</label>
            <input
              type={field === 'servings' ? 'number' : 'text'}
              name={field}
              value={form[field]}
              onChange={handleChange}
              className="w-full border p-2 rounded"
              required
            />
          </div>
        ))}

        <div>
          <label className="block text-sm font-medium mb-1">Upload Cover Photo</label>
          <input
            type="file"
            accept="image/*"
            onChange={async (e) => {
              const file = e.target.files[0];
              if (file) {
                const url = await handleImageUpload(file);
                if (url) setForm(f => ({ ...f, image_url: url }));
              }
            }}
            className="w-full"
          />
          {form.image_url && <img src={form.image_url} className="mt-2 w-full h-40 object-cover rounded" />}
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Ingredients (one per line)</label>
          <textarea
            name="ingredients"
            value={form.ingredients}
            onChange={handleChange}
            className="w-full border p-2 rounded"
            rows={4}
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Steps (one per line)</label>
          <textarea
            name="steps"
            value={form.steps}
            onChange={handleChange}
            className="w-full border p-2 rounded"
            rows={4}
            required
          />
        </div>

        <button type="submit" className="bg-black text-white px-4 py-2 rounded hover:bg-gray-800">
          Submit Recipe
        </button>

        {message && <p className="text-sm mt-2 text-green-700">{message}</p>}
      </form>
    </div>
  );
}
