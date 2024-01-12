import React, { useEffect, useState } from "react";
import { auth, db } from "../firebase";
import { doc, getDoc } from "firebase/firestore";

import { logout } from "../utils/utils";
import { useNavigate } from "react-router-dom";

export const Profile = () => {
  const user = auth.currentUser;

  const style = {
    bg: `w-screen font-quicksand`,
    container: `font-quicksand max-w-[500px] w-full h-full m-auto rounded-md p-4 flex flex-col`,
    bigHeader: "text-4xl flex font-bold mb-4 text-black",
    heading: `text-2xl flex font-bold text-black py-2`,
    form: `flex justify-between`,
    input: `border p-2 my-1 w-full text-xl`,
    button: `border p-4 mt-4 bg-pink text-black w-full font-bold`,
    icon: `transition ease-in-out delay-70 hover:scale-130 duration-70`,
    bottom: `flex flex-col items-center gap-2`,
    count: `text-center p-2`,
    deleteAllButton: `flex border p-4 bg-pink`,
    info: `mt-5`,
    link: `text-pink font-bold cursor-pointer`,
    userData: "text-xl",
  };

  const [email, setEmail] = useState("");
  const [nickname, setNickname] = useState("");
  const [userId, setUserId] = useState("");

  const navigate = useNavigate();

  const getUserData = async () => {
    try {
      const userDocRef = doc(db, "users", user.uid);
      const userDocSnapshot = await getDoc(userDocRef);

      if (userDocSnapshot.exists()) {
        const userData = userDocSnapshot.data();
        setEmail(userData.email);
        setNickname(userData.nickname);
        setUserId(userData.userId);
      }
    } catch (error) {
      console.error("Error getting user data:", error);
    }
  };

  const goToLogin = () => {
    navigate("/");
  };

  useEffect(() => {
    getUserData();
  }, []);

  return (
    <div className={style.container}>
      <h1 className={style.bigHeader}>
        {" "}
        <span className={style.icon}>👤</span> <p>Tili</p>
      </h1>
      <p className={style.userData}>
        <span className="bg-dogwood font-bold">Käyttäjätunnus:</span>
        {" " + nickname}
      </p>
      <p className={style.userData}>
        <span className="bg-dogwood font-bold">Sähköposti:</span> {" " + email}
      </p>
      <button
        className={style.button}
        onClick={() => {
          logout();
          goToLogin();
        }}
      >
        Kirjaudu ulos
      </button>
    </div>
  );
};
