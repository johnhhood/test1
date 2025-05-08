import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';
import { useSession } from '../lib/SessionContext';

// Helper to sanitize uploaded filenames
function sanitizeFilename(name) {
  return name
    .toLowerCase()
    .replace(/\s+/g, '-')          // spaces to dashes
    .replace(/[^a-z0-9.-]/g, '')   // remove special chars except . and -
    .replace(/-+/g, '-');          // remove duplicate dashes
}

export default function SubmitRecipe() {
  const { user } = useSession();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    title: '',
    ingredients: '',
    steps: '',
    cook_time: '',
    servings: '',
    tags: ''
  });

  const [file, setFile] = useState(null);
  const [previewURL, setPreviewURL] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(null);
  const [message, setMessage] = useState('');

  const handleChange = (e) => {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
  };

  const handleFileChange = (e) => {
    const selected = e.target.files[0];
    setFile(selected);
    setPreviewURL(URL.createObjectURL(selected));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) return alert('Login required');

    let imageUrl = null;

    if (file) {
      const filename = `${user.id}/${sanitizeFilename(file.name)}`;
      const { data, error: uploadError } = await supabase.storage
        .from('recipe-images')
        .upload(filename, file, {
          upsert: true
        });

      if (uploadError) {
        console.error('Image upload error:', uploadError.message);
        setMessage('❌ Failed to upload image.');
        return;
      }

      imageUrl = supabase.storage
        .from('recipe-images')
        .getPublicUrl(filename).data.publicUrl;
    }

    const recipeData = {
      title: form.title.trim(),
      ingredients: form.ingredients.trim(),
      steps: form.steps.trim(),
      cook_time: form.cook_time,
      servings: parseInt(form.servings, 10),
      tags: form.tags
        .split(',')
        .map((tag) => tag.trim())
        .filter(Boolean),
      image_url: imageUrl,
      author_id: user.id
    };

    const { error } = await supabase.from('recipes').insert([recipeData]);

    if (error) {
      console.error('Submit error:', error.message);
      setMessage('❌ Failed to submit recipe.');
    } else {
      navigate('/submitted');
    }
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
          required
        />
        <textarea
          name="ingredients"
          placeholder="Ingredients (one per line)"
          value={form.ingredients}
          onChange={handleChange}
          className="form-textarea"
          required
        />
        <textarea
          name="steps"
          placeholder="Steps (one per line)"
          value={form.steps}
          onChange={handleChange}
          className="form-textarea"
          required
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
        <input
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="form-input"
        />

        {previewURL && (
          <div className="preview">
            <p>Image Preview:</p>
            <img src={previewURL} alt="Preview" style={{ maxWidth: '200px', marginBottom: '1rem' }} />
          </div>
        )}

        {uploadProgress !== null && (
          <div className="progress-bar">
            <p>Uploading: {uploadProgress}%</p>
            <progress value={uploadProgress} max="100" />
          </div>
        )}

        <button type="submit" className="form-button">
          Submit
        </button>
        {message && <p className="form-message">{message}</p>}
      </form>
    </div>
  );
}
