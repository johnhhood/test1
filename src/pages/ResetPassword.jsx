import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

export default function ResetPassword() {
  const [password, setPassword] = useState('');
  const [confirmed, setConfirmed] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const checkReset = async () => {
      const { data, error } = await supabase.auth.getSession();
      if (error || !data.session) {
        toast.error("Invalid or expired reset link.");
      } else {
        setConfirmed(true);
      }
    };
    checkReset();
  }, []);

  const handleReset = async (e) => {
    e.preventDefault();
    const { error } = await supabase.auth.updateUser({ password });
    if (error) toast.error(error.message);
    else {
      toast.success("Password updated! Please log in.");
      navigate('/login');
    }
  };

  if (!confirmed) return <p className="reset-loading">Verifying reset link...</p>;

  return (
    <div className="auth-container">
      <h2 className="auth-title">Set a New Password</h2>
      <form onSubmit={handleReset} className="auth-form">
        <input
          type="password"
          placeholder="New password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="form-input"
          required
        />
        <button type="submit" className="form-button full-width">
          Update Password
        </button>
      </form>
    </div>
  );
}
