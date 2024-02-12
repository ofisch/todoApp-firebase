import { useEffect, useState } from "react";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";
import {
  collection,
  addDoc,
  query,
  where,
  getDocs,
  doc,
  setDoc,
} from "firebase/firestore";
import { auth, db } from "../firebase";
import { RegisterForm } from "../components/RegisterForm";
import { LoginForm } from "../components/LoginForm";
import { loginStyle } from "../styles/loginStyle";
import { useNavigate } from "react-router-dom";
import { isEmail } from "../utils/utils";

export const Login = () => {
  const [registerMode, setRegisterMode] = useState(false);

  const [registerEmail, setRegisterEmail] = useState("");
  const [registerNick, setRegisterNick] = useState("");
  const [registerPassword, setRegisterPassword] = useState("");
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");

  const navigate = useNavigate();

  document.body.style = "background-color: #04A777;";

  const addUserToDB = async (userEmail, userNick) => {
    const usersCollectionRef = collection(db, "users");

    const newUserDocRef = doc(usersCollectionRef, auth.currentUser.uid);

    await setDoc(newUserDocRef, {
      email: userEmail,
      nickname: userNick,
      color: "#04A777",
    });
  };

  const register = async () => {
    try {
      await createUserWithEmailAndPassword(
        auth,
        registerEmail,
        registerPassword
      );
      addUserToDB(registerEmail, registerNick);
      navigate("/");
    } catch (error) {
      console.log(error);
    }
  };

  const login = async () => {
    try {
      if (isEmail(loginEmail)) {
        await signInWithEmailAndPassword(auth, loginEmail, loginPassword);
      } else {
        const usersCollection = collection(db, "users");
        const nicknameQuery = query(
          usersCollection,
          where("nickname", "==", loginEmail)
        );
        const querySnapshot = await getDocs(nicknameQuery);

        if (!querySnapshot.empty) {
          const userDoc = querySnapshot.docs[0];
          const userEmail = userDoc.data().email;
          await signInWithEmailAndPassword(auth, userEmail, loginPassword);
        }
      }

      navigate("/");
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (auth.currentUser) {
      navigate("/");
    }
  }, []);

  return (
    <>
      <div className={loginStyle.container}>
        {registerMode ? (
          <RegisterForm
            register={register}
            registerEmail={registerEmail}
            registerNick={registerNick}
            registerPassword={registerPassword}
            setRegisterEmail={setRegisterEmail}
            setRegisterNick={setRegisterNick}
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
