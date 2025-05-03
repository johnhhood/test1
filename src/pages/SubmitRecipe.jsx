import { useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import { useSession } from '../lib/SessionContext';

export default function SubmitRecipe() {
  const { user } = useSession();
  const [form, setForm] = useState({
    title: '', ingredients: '', steps: '', cook_time: '', servings: '', tags: '', image_url: ''
  });
  const [message, setMessage] = useState('');

  const handleChange = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = async e => {
    e.preventDefault();
    if (!user) return alert("Login required");

    const { error } = await supabase.from('recipes').insert([{
      ...form,
      author_id: user.id,
      tags: form.tags.split(',').map(tag => tag.trim()),
      is_approved: false
    }]);

    setMessage(error ? 'Failed to submit.' : 'Recipe submitted for review!');
  };

  return (
   <div className="max-w-lg mx-auto p-6 bg-white border rounded shadow">
    <h2 className="text-xl font-bold mb-4">Submit a Recipe</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Title</label>
          <input
            type="text"
            className="w-full border p-2 rounded"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>
      ))}
      <textarea name="ingredients" value={form.ingredients} onChange={handleChange}
                placeholder="Ingredients (one per line)" className="w-full border p-2" />
      <textarea name="steps" value={form.steps} onChange={handleChange}
                placeholder="Steps (one per line)" className="w-full border p-2" />
      <button className="bg-black text-white px-4 py-2">Submit</button>
      {message && <p className="text-sm text-green-600">{message}</p>}
    </form>
  </div>
  );
}
