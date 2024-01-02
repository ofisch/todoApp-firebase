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

export const Login = () => {
  const [registerMode, setRegisterMode] = useState(false);

  const [registerEmail, setRegisterEmail] = useState("");
  const [registerPassword, setRegisterPassword] = useState("");
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");

  const [user, setUser] = useState({});

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
      alert("User logged in successfully");
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
        <LoginForm
          login={login}
          loginEmail={loginEmail}
          loginPassword={loginPassword}
          setLoginEmail={setLoginEmail}
          setLoginPassword={setLoginPassword}
          setRegisterMode={setRegisterMode}
        />
      )}
      <h4>Users logged in:</h4>
      {user?.email}

      <button onClick={logout}>Sign out</button>
    </>
  );
};
