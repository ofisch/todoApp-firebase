import { homeStyle } from "../styles/homeStyle";
import { loginStyle } from "../styles/loginStyle";

export const LoginForm = (props) => {
  const {
    loginEmail,
    loginPassword,
    setLoginEmail,
    setLoginPassword,
    login,
    setRegisterMode,
  } = props;

  const handleFormSubmit = (e) => {
    e.preventDefault();
    login();
  };

  return (
    <form onSubmit={handleFormSubmit}>
      <div>
        <h1 className={loginStyle.bigHeader}>
          <span className={loginStyle.icon}>🍉</span>KauppaKamu
        </h1>
        <h2 className={loginStyle.heading}>
          <span className={loginStyle.icon}>🔑</span>Kirjaudu
        </h2>
        <label>Sähköposti tai käyttäjänimi:</label>
        <input
          className={loginStyle.input}
          placeholder="syötä sähköposti"
          spellCheck="false"
          type="text"
          value={loginEmail}
          onChange={(e) => setLoginEmail(e.target.value)}
        />

        <label>Salasana:</label>
        <input
          className={loginStyle.input}
          placeholder="syötä salasana"
          spellCheck="false"
          type="password"
          value={loginPassword}
          onChange={(e) => setLoginPassword(e.target.value)}
        />
        <button type="submit" className={loginStyle.button}>
          <p className="font-bold">Kirjaudu sisään</p>
        </button>
        <p className="text-center mt-4">
          Etkö ole vielä rekisteröitynyt?{" "}
          <span
            className={loginStyle.link}
            onClick={() => setRegisterMode(true)}
          >
            Rekisteröidy
          </span>
        </p>
      </div>
    </form>
  );
};
