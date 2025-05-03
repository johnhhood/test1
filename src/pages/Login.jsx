import { useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import toast from 'react-hot-toast';

export default function Login() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    const { error } = await supabase.auth.signInWithOtp({ email });

    setLoading(false);

    if (error) {
      toast.error('Login failed: ' + error.message);
    } else {
      toast.success('Check your email for a magic login link');
      setEmail('');
    }
  };

  return (
    <div className="max-w-md mx-auto p-4 mt-12 border rounded">
      <h2 className="text-xl font-bold mb-4">Log in to Jump to Recipe</h2>
      <form onSubmit={handleLogin} className="space-y-4">
        <input
          type="email"
          placeholder="you@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full border p-2"
          required
        />
        <button
          type="submit"
          disabled={loading}
          className="bg-black text-white px-4 py-2"
        >
          {loading ? 'Sending...' : 'Send Magic Link'}
        </button>
      </form>
    </div>
  );
}
