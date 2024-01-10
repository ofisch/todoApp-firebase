import { loginStyle } from "../styles/loginStyle";

export const RegisterForm = (props) => {
  // Access the parameters using props
  const {
    registerEmail,
    registerNick,
    registerPassword,
    setRegisterEmail,
    setRegisterNick,
    setRegisterPassword,
    register,
    setRegisterMode,
  } = props;

  const handleFormSubmit = (e) => {
    e.preventDefault();
    register();
  };

  return (
    <form onSubmit={handleFormSubmit}>
      <div>
        <h1 className={loginStyle.bigHeader}>
          <span className={loginStyle.icon}>🍉</span>KauppaKamu
        </h1>
        <h2 className={loginStyle.heading}>
          <span className={loginStyle.icon}>🔐</span>Rekisteröidy
        </h2>
        <label>Sähköposti:</label>
        <input
          className={loginStyle.input}
          placeholder="syötä sähköposti"
          spellCheck="false"
          type="text"
          value={registerEmail}
          onChange={(e) => setRegisterEmail(e.target.value)}
        />
        <label>Käyttäjänimi:</label>
        <input
          className={loginStyle.input}
          placeholder="syötä käyttäjänimi"
          spellCheck="false"
          type="text"
          value={registerNick}
          onChange={(e) => setRegisterNick(e.target.value)}
        />
        <label>Salasana:</label>
        <input
          className={loginStyle.input}
          placeholder="syötä salasana"
          spellCheck="false"
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
    </form>
  );
};
