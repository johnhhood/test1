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
    <form onSubmit={handleSubmit} className="max-w-xl space-y-4">
      {['title', 'cook_time', 'servings', 'tags', 'image_url'].map(field => (
        <input key={field} name={field} value={form[field]} onChange={handleChange}
               placeholder={field} className="w-full border p-2" />
      ))}
      <textarea name="ingredients" value={form.ingredients} onChange={handleChange}
                placeholder="Ingredients (one per line)" className="w-full border p-2" />
      <textarea name="steps" value={form.steps} onChange={handleChange}
                placeholder="Steps (one per line)" className="w-full border p-2" />
      <button className="bg-black text-white px-4 py-2">Submit</button>
      {message && <p className="text-sm text-green-600">{message}</p>}
    </form>
  );
}
