export default function Login() {
  return (
    <div className="login-container">
      <h1 className="login-title">Login</h1>
      <form className="login-form">
        <input type="email" className="form-input" placeholder="Email" />
        <input type="password" className="form-input" placeholder="Password" />
        <button className="form-button">Log In</button>
      </form>
    </div>
  );
}