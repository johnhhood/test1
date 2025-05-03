import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';
import { useSession } from '../lib/SessionContext';

export default function RecipeDetail() {
  const { id } = useParams();
  const { user } = useSession();
  const [recipe, setRecipe] = useState(null);
  const [saved, setSaved] = useState(false);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [comments, setComments] = useState([]);
  const [editIndex, setEditIndex] = useState(null);
  const [editContent, setEditContent] = useState('');

  useEffect(() => {
    const fetchRecipe = async () => {
      const { data } = await supabase
        .from('recipes')
        .select('*')
        .eq('id', id)
        .single();
      setRecipe(data);
    };

    const fetchComments = async () => {
      const { data } = await supabase
        .from('recipe_comments')
        .select('*')
        .eq('recipe_id', id)
        .order('created_at', { ascending: false });
      setComments(data);
    };

    fetchRecipe();
    fetchComments();
  }, [id]);

  const saveToCookbook = async () => {
    if (!user) return alert('Log in to save.');
    const { error } = await supabase.from('cookbook_recipes').insert([
      { user_id: user.id, recipe_id: recipe.id }
    ]);
    if (!error) setSaved(true);
  };

  const refreshComments = async () => {
    const { data } = await supabase
      .from('recipe_comments')
      .select('*')
      .eq('recipe_id', id)
      .order('created_at', { ascending: false });
    setComments(data);
  };

  const submitComment = async () => {
    if (!user || !comment || rating === 0) return;
    await supabase.from('recipe_comments').insert([{
      user_id: user.id,
      recipe_id: id,
      comment,
      rating,
      author_name: user.user_metadata?.name || user.email
    }]);
    setComment('');
    setRating(0);
    refreshComments();
  };

  const deleteComment = async (commentId) => {
    await supabase.from('recipe_comments').delete().eq('id', commentId);
    refreshComments();
  };

  const updateComment = async (commentId) => {
    await supabase.from('recipe_comments').update({ comment: editContent }).eq('id', commentId);
    setEditIndex(null);
    setEditContent('');
    refreshComments();
  };

  if (!recipe) return <p className="text-center mt-8">Loading...</p>;

  return (
    <div className="max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-2">{recipe.title}</h1>
      {recipe.image_url && (
        <img src={recipe.image_url} alt={recipe.title} className="w-full h-64 object-cover mb-4" />
      )}
      {recipe.tags?.length > 0 && (
        <p className="text-sm text-gray-600 mb-4">Tags: {recipe.tags.join(', ')}</p>
      )}
      <div className="mb-4">
        <p><strong>Cook Time:</strong> {recipe.cook_time}</p>
        <p><strong>Servings:</strong> {recipe.servings}</p>
      </div>
      <div className="mb-4">
        <h2 className="text-lg font-semibold">Ingredients</h2>
        <ul className="list-disc list-inside">
          {recipe.ingredients?.split('\n').map((line, i) => (
            <li key={i}>{line}</li>
          ))}
        </ul>
      </div>
      <div className="mb-4">
        <h2 className="text-lg font-semibold">Steps</h2>
        <ol className="list-decimal list-inside space-y-1">
          {recipe.steps?.split('\n').map((step, i) => (
            <li key={i}>{step}</li>
          ))}
        </ol>
      </div>

      {user && !saved && (
        <button onClick={saveToCookbook} className="bg-black text-white px-4 py-2 mt-4">Save to Cookbook</button>
      )}
      {user && saved && (
        <p className="text-green-600 mt-4">Saved to your cookbook.</p>
      )}

      <div className="mt-8">
        <h2 className="text-lg font-semibold mb-2">Leave a Review</h2>
        {user ? (
          <div className="space-y-2">
            <div className="flex items-center gap-1">
              {[1, 2, 3, 4, 5].map(n => (
                <button key={n} onClick={() => setRating(n)} className={n <= rating ? 'text-yellow-500' : 'text-gray-400'}>
                  ★
                </button>
              ))}
            </div>
            <textarea
              className="w-full border p-2"
              placeholder="Write your comment..."
              value={comment}
              onChange={(e) => setComment(e.target.value)}
            />
            <button onClick={submitComment} className="bg-black text-white px-4 py-1">Submit</button>
          </div>
        ) : (
          <p className="text-sm text-gray-600">Log in to leave a comment.</p>
        )}
      </div>

      <div className="mt-8">
        <h2 className="text-lg font-semibold mb-2">Comments</h2>
        {comments.length === 0 ? (
          <p className="text-sm text-gray-600">No comments yet.</p>
        ) : (
          <ul className="space-y-4">
            {comments.map((c) => (
              <li key={c.id} className="border p-2">
                <p className="text-sm font-semibold">{c.author_name}</p>
                <p className="text-yellow-600">{'★'.repeat(c.rating)}{'☆'.repeat(5 - c.rating)}</p>
                {user?.id === c.user_id && editIndex === c.id ? (
                  <div className="space-y-2">
                    <textarea
                      className="w-full border p-2"
                      value={editContent}
                      onChange={(e) => setEditContent(e.target.value)}
                    />
                    <div className="flex gap-2">
                      <button onClick={() => updateComment(c.id)} className="bg-blue-600 text-white px-2 py-1">Save</button>
                      <button onClick={() => setEditIndex(null)} className="bg-gray-400 text-white px-2 py-1">Cancel</button>
                    </div>
                  </div>
                ) : (
                  <>
                    <p>{c.comment}</p>
                    {user?.id === c.user_id && (
                      <div className="mt-2 space-x-2 text-sm">
                        <button onClick={() => { setEditIndex(c.id); setEditContent(c.comment); }} className="text-blue-600 underline">Edit</button>
                        <button onClick={() => deleteComment(c.id)} className="text-red-600 underline">Delete</button>
                      </div>
                    )}
                  </>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
