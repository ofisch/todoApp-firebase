import { useEffect, useState } from "react";
import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";
import { auth } from "../firebase";
import { RegisterForm } from "../components/RegisterForm";
import { LoginForm } from "../components/LoginForm";
import { loginStyle } from "../styles/loginStyle";
import { useNavigate } from "react-router-dom";

export const Login = () => {
  const [registerMode, setRegisterMode] = useState(false);

  const [registerEmail, setRegisterEmail] = useState("");
  const [registerPassword, setRegisterPassword] = useState("");
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");

  const [user, setUser] = useState({});

  const navigate = useNavigate();

  useEffect(() => {
    onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
  });

  const register = async () => {
    try {
      await createUserWithEmailAndPassword(
        auth,
        registerEmail,
        registerPassword
      );
      alert("User created successfully");
    } catch (error) {
      console.log(error);
    }
  };

  const login = async () => {
    try {
      await signInWithEmailAndPassword(auth, loginEmail, loginPassword);
      navigate("/home");
    } catch (error) {
      console.log(error);
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <div className={loginStyle.container}>
        {registerMode ? (
          <RegisterForm
            register={register}
            registerEmail={registerEmail}
            registerPassword={registerPassword}
            setRegisterEmail={setRegisterEmail}
            setRegisterPassword={setRegisterPassword}
            setRegisterMode={setRegisterMode}
          />
        ) : (
          <>
            <LoginForm
              login={login}
              loginEmail={loginEmail}
              loginPassword={loginPassword}
              setLoginEmail={setLoginEmail}
              setLoginPassword={setLoginPassword}
              setRegisterMode={setRegisterMode}
            />
          </>
        )}
      </div>
    </>
  );
};
