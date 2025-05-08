import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import { Link } from 'react-router-dom';

export default function Moderate() {
  const [pendingRecipes, setPendingRecipes] = useState([]);
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    fetchUser();
    fetchPendingRecipes();
  }, []);

  const fetchUser = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (session?.user?.id) setUserId(session.user.id);
  };

  const fetchPendingRecipes = async () => {
    const { data, error } = await supabase
      .from('recipes')
      .select('*')
      .eq('status', 'pending');

    if (error) {
      console.error('Error fetching pending recipes:', error.message);
    } else {
      setPendingRecipes(data);
    }
  };

  const handleAction = async (id, action) => {
    if (!userId) return;

    const updateFields =
      action === 'approve'
        ? {
            status: 'approved',
            is_approved: true,
            approved_by: userId,
            rejected_by: null
          }
        : {
            status: 'rejected',
            is_approved: false,
            rejected_by: userId,
            approved_by: null
          };

    const { error } = await supabase
      .from('recipes')
      .update(updateFields)
      .eq('id', id);

    if (error) {
      console.error(`Error updating recipe status:`, error.message);
    } else {
      setPendingRecipes(prev => prev.filter(recipe => recipe.id !== id));
    }
  };

  return (
    <div className="moderate-container">
      <h1 className="moderate-title">Moderation Queue</h1>
      {pendingRecipes.length === 0 ? (
        <p>No recipes pending approval.</p>
      ) : (
        <ul className="moderate-list">
          {pendingRecipes.map(recipe => (
            <li key={recipe.id} className="moderate-item">
              <Link to={`/recipes/${recipe.id}`} className="moderate-link">
                {recipe.title}
              </Link>
              <div className="moderation-actions">
                <button onClick={() => handleAction(recipe.id, 'approve')}>
                  Approve
                </button>
                <button onClick={() => handleAction(recipe.id, 'reject')}>
                  Reject
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
