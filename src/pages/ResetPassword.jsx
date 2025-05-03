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

  if (!confirmed) return <p className="p-4">Verifying reset link...</p>;

  return (
    <div className="max-w-md mx-auto p-4 mt-12 border rounded">
      <h2 className="text-xl font-bold mb-4">Set a New Password</h2>
      <form onSubmit={handleReset} className="space-y-4">
        <input
          type="password"
          placeholder="New password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full border p-2"
          required
        />
        <button type="submit" className="bg-black text-white px-4 py-2 w-full">
          Update Password
        </button>
      </form>
    </div>
  );
}
