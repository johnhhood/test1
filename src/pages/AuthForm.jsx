import { useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import toast from 'react-hot-toast';

export default function AuthForm() {
  const [mode, setMode] = useState('login'); // or 'signup'
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [birthday, setBirthday] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (mode === 'signup') {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { name, birthday }
        }
      });

      if (error) toast.error('Signup failed: ' + error.message);
      else toast.success('Signup successful! You can now log in.');
    } else {
      const { error } = await supabase.auth.signInWithPassword({ email, password });

      if (error) toast.error('Login failed: ' + error.message);
      else toast.success('Logged in!');
    }

    setLoading(false);
  };

  return (
    <div className="max-w-md mx-auto p-4 mt-12 border rounded">
      <h2 className="text-xl font-bold mb-4">{mode === 'signup' ? 'Sign Up' : 'Log In'}</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        {mode === 'signup' && (
          <>
            <input
              type="text"
              placeholder="Your name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full border p-2"
              required
            />
            <input
              type="date"
              value={birthday}
              onChange={(e) => setBirthday(e.target.value)}
              className="w-full border p-2"
              required
            />
          </>
        )}
        <input
          type="email"
          placeholder="you@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full border p-2"
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full border p-2"
          required
        />
        <button
          type="submit"
          disabled={loading}
          className="bg-black text-white px-4 py-2 w-full"
        >
          {loading ? 'Working...' : mode === 'signup' ? 'Create Account' : 'Log In'}
        </button>
      </form>

      <div className="mt-4 text-sm text-center">
        {mode === 'signup' ? (
          <>
            Already have an account?{' '}
            <button onClick={() => setMode('login')} className="text-blue-600 underline">Log in</button>
          </>
        ) : (
          <>
            New here?{' '}
            <button onClick={() => setMode('signup')} className="text-blue-600 underline">Sign up</button>
          </>
        )}
      </div>
    </div>
  );
}
