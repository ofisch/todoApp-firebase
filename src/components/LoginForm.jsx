export const LoginForm = (props) => {
  const {
    loginEmail,
    loginPassword,
    setLoginEmail,
    setLoginPassword,
    login,
    setRegisterMode,
  } = props;

  return (
    <div>
      <h2>Login</h2>
      <label>Email:</label>
      <input
        type="email"
        value={loginEmail}
        onChange={(e) => setLoginEmail(e.target.value)}
      />
      <label>Password:</label>
      <input
        type="password"
        value={loginPassword}
        onChange={(e) => setLoginPassword(e.target.value)}
      />
      <button onClick={login}>Login</button>
      <p>
        Don't have an account?{" "}
        <span onClick={() => setRegisterMode(true)}>Register here</span>.
      </p>
    </div>
  );
};
