import { loginStyle } from "../styles/loginStyle";

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
      <h2 className={loginStyle.heading}>
        <span className={loginStyle.icon}>🔐</span>Rekisteröidy
      </h2>
      <label>Sähköposti:</label>
      <input
        className={loginStyle.input}
        type="email"
        value={registerEmail}
        onChange={(e) => setRegisterEmail(e.target.value)}
      />
      <label>Salasana:</label>
      <input
        className={loginStyle.input}
        type="password"
        value={registerPassword}
        onChange={(e) => setRegisterPassword(e.target.value)}
      />
      <button className={loginStyle.button} onClick={register}>
        <p className="font-bold">Rekisteröidy</p>
      </button>
      <p className="text-center mt-4">
        Oletko jo rekisteröitynyt?{" "}
        <span
          className={loginStyle.link}
          onClick={() => setRegisterMode(false)}
        >
          Kirjaudu sisään
        </span>
      </p>
    </div>
  );
};
