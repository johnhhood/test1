import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';
import { useSession } from '../lib/SessionContext';

// Sanitize image filename
function sanitizeFilename(name) {
  return name
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9.-]/g, '')
    .replace(/-+/g, '-');
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
      setUploadProgress(0);

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

      setUploadProgress(100);
    }

    const recipeData = {
      title: form.title.trim(),
      ingredients: form.ingredients
        .split('\n')
        .map(line => line.trim())
        .filter(Boolean),
      steps: form.steps
        .split('\n')
        .map(step => step.trim())
        .filter(Boolean),
      cook_time: form.cook_time.trim(),
      servings: parseInt(form.servings, 10) || null,
      tags: form.tags
        .split(',')
        .map(tag => tag.trim())
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
    <div className="submit-container" style={{ padding: 40 }}>
      <h2>Submit a Recipe</h2>
      <form onSubmit={handleSubmit} className="submit-form" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <input type="text" name="title" placeholder="Title" value={form.title} onChange={handleChange} required />
        <textarea name="ingredients" placeholder="Ingredients (one per line)" value={form.ingredients} onChange={handleChange} required />
        <textarea name="steps" placeholder="Steps (one per line)" value={form.steps} onChange={handleChange} required />
        <input type="text" name="cook_time" placeholder="Cook time" value={form.cook_time} onChange={handleChange} />
        <input type="number" name="servings" placeholder="Servings" value={form.servings} onChange={handleChange} />
        <input type="text" name="tags" placeholder="Comma-separated tags" value={form.tags} onChange={handleChange} />
        <input type="file" accept="image/*" onChange={handleFileChange} />

        {previewURL && (
          <div>
            <p>Image Preview:</p>
            <img src={previewURL} alt="Preview" style={{ maxWidth: '200px' }} />
          </div>
        )}

        {uploadProgress !== null && (
          <div>
            <p>Uploading: {uploadProgress}%</p>
            <progress value={uploadProgress} max="100" />
          </div>
        )}

        <button type="submit">Submit</button>
        {message && <p>{message}</p>}
      </form>
    </div>
  );
}
