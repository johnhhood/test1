import { useState } from 'react';
import { supabase } from '../lib/supabaseClient';

export default function Login() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    setStatus('Sending magic link...');

    const { error } = await supabase.auth.signInWithOtp({ email });

    if (error) {
      console.error(error.message);
      setStatus('Login failed. Try again.');
    } else {
      setStatus('Check your email for the login link.');
    }
  };

  return (
    <div style={{ padding: 40 }}>
      <h2>Login</h2>
      <form onSubmit={handleLogin}>
        <input
          type="email"
          placeholder="Enter email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          style={{ padding: 8, width: '100%', marginBottom: 10 }}
        />
        <button type="submit" style={{ padding: 8 }}>
          Send Magic Link
        </button>
      </form>
      <p>{status}</p>
    </div>
  );
}
