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
    <div className="auth-container">
      <h2 className="auth-title">{mode === 'signup' ? 'Sign Up' : 'Log In'}</h2>

      <form onSubmit={handleSubmit} className="auth-form">
        {mode === 'signup' && (
          <>
            <input
              type="text"
              placeholder="Your name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="form-input"
              required
            />
            <input
              type="date"
              value={birthday}
              onChange={(e) => setBirthday(e.target.value)}
              className="form-input"
              required
            />
          </>
        )}
        <input
          type="email"
          placeholder="you@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="form-input"
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="form-input"
          required
        />
        <button
          type="submit"
          disabled={loading}
          className="form-button full-width"
        >
          {loading ? 'Working...' : mode === 'signup' ? 'Create Account' : 'Log In'}
        </button>
      </form>

      {mode === 'login' && (
        <div className="auth-reset">
          <button
            onClick={async () => {
              if (!email) return toast.error("Enter your email first.");
              const { error } = await supabase.auth.resetPasswordForEmail(email, {
                redirectTo: 'https://test1-umber-theta.vercel.app/'
              });
              if (error) toast.error(error.message);
              else toast.success("Check your email for reset link.");
            }}
            className="link-button"
          >
            Forgot password?
          </button>
        </div>
      )}

      <div className="auth-toggle">
        {mode === 'signup' ? (
          <>
            Already have an account?{' '}
            <button onClick={() => setMode('login')} className="link-button">Log in</button>
          </>
        ) : (
          <>
            New here?{' '}
            <button onClick={() => setMode('signup')} className="link-button">Sign up</button>
          </>
        )}
      </div>
    </div>
  );
}
