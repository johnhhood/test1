import { useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import { useSession } from '../lib/SessionContext';

export default function SubmitRecipe() {
  const { user } = useSession();
  const [form, setForm] = useState({
    title: '', ingredients: '', steps: '', cook_time: '', servings: '', tags: '', image_url: ''
  });
  const [message, setMessage] = useState('');

  const handleChange = e => {
    setForm(f => ({ ...f, [e.target.name]: e.target.value }));
  };

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
    <div className="submit-container">
      <h2 className="submit-title">Submit a Recipe</h2>
      <form onSubmit={handleSubmit} className="submit-form">
        <input
          type="text"
          name="title"
          placeholder="Title"
          value={form.title}
          onChange={handleChange}
          className="form-input"
        />
        <textarea
          name="ingredients"
          placeholder="Ingredients (one per line)"
          value={form.ingredients}
          onChange={handleChange}
          className="form-textarea"
        />
        <textarea
          name="steps"
          placeholder="Steps (one per line)"
          value={form.steps}
          onChange={handleChange}
          className="form-textarea"
        />
        <input
          type="text"
          name="cook_time"
          placeholder="Cook time"
          value={form.cook_time}
          onChange={handleChange}
          className="form-input"
        />
        <input
          type="number"
          name="servings"
          placeholder="Servings"
          value={form.servings}
          onChange={handleChange}
          className="form-input"
        />
        <input
          type="text"
          name="tags"
          placeholder="Comma-separated tags"
          value={form.tags}
          onChange={handleChange}
          className="form-input"
        />
        <button type="submit" className="form-button">Submit</button>
        {message && <p className="form-message">{message}</p>}
      </form>
    </div>
  );
}
