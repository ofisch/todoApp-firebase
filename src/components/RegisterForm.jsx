export const RegisterForm = (props) => {
  // Access the parameters using props
  const {
    registerEmail,
    registerPassword,
    setRegisterEmail,
    setRegisterPassword,
    register,
    setRegisterMode,
  } = props;

  return (
    <div>
      <h2>Register</h2>
      <label>Email:</label>
      <input
        type="email"
        value={registerEmail}
        onChange={(e) => setRegisterEmail(e.target.value)}
      />
      <label>Password:</label>
      <input
        type="password"
        value={registerPassword}
        onChange={(e) => setRegisterPassword(e.target.value)}
      />
      <button onClick={register}>Register</button>
      <p>
        Already have an account?{" "}
        <span onClick={() => setRegisterMode(false)}>Login here</span>.
      </p>
    </div>
  );
};
