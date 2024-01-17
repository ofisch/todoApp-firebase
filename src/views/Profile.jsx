import React, { useEffect, useState } from "react";
import { auth, db } from "../firebase";
import { deleteDoc, doc, getDoc } from "firebase/firestore";

import { logout } from "../utils/utils";
import { useNavigate } from "react-router-dom";

export const Profile = () => {
  const [user, setUser] = useState(auth.currentUser);

  const style = {
    container:
      "font-quicksand max-w-[500px] w-full h-full m-auto rounded-md p-4 flex flex-col",
    bigHeader: "text-4xl flex font-bold mb-4 text-pink-600",
    icon: "transition ease-in-out delay-70 transform hover:scale-110 duration-300",
    userDataContainer: "mt-4",
    userData: "text-xl text-black mb-2",
    dataLabel: "bg-dogwood font-bold p-1 rounded-md inline-block",
    button: `border p-4 mt-4 bg-pink text-black w-full font-bold`,
    deleteAllButton: `flex border p-4 bg-pink`,
    link: `text-pink font-bold bg-dogwood w-fit cursor-pointer`,
    plus: `transition ease-in-out delay-70 hover:scale-130 duration-70`,
  };

  const [email, setEmail] = useState("");
  const [nickname, setNickname] = useState("");
  const [userId, setUserId] = useState("");

  const navigate = useNavigate();

  const getUserData = async (uid) => {
    try {
      const userDocRef = doc(db, "users", uid);
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
    navigate("/login");
  };

  const deleteAccount = async () => {
    try {
      const nicknameInput = prompt("Syötä käyttäjätunnus jatkaaksesi");
      if (nicknameInput === nickname) {
        if (
          window.confirm(
            "❗ Menetettyjä tietoja ei voida palauttaa, haluatko poistaa tilin?"
          )
        ) {
          const userDocRef = doc(db, "users", user.uid);
          await deleteDoc(userDocRef);
          await user.delete();
          alert("Tili poistettu");
          goToLogin();
        }
      } else {
        alert("❌ Käyttäjätunnuksen vahvistaminen epäonnistui");
      }
    } catch (error) {
      console.error("Error deleting user:", error);
    }
  };

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setUser(user);
      if (user) {
        getUserData(user.uid);
      }
    });

    return () => unsubscribe();
  }, []);

  return (
    <div className={style.container}>
      <h1 className={style.bigHeader}>
        <span className={style.icon}>👤</span> Tili
      </h1>
      <div className={style.userDataContainer}>
        <p className={style.userData}>
          <span className={`${style.dataLabel} ${style.dogwood} font-bold`}>
            Käyttäjätunnus:
          </span>{" "}
          {nickname}
        </p>
        <p className={style.userData}>
          <span className={`${style.dataLabel} ${style.dogwood} font-bold`}>
            Sähköposti:
          </span>{" "}
          {email}
        </p>
      </div>
      <button
        className={style.button}
        onClick={() => {
          logout();
          goToLogin();
        }}
      >
        Kirjaudu ulos
      </button>
      <button
        onClick={() => deleteAccount()}
        className={`${style.deleteAllButton} m-auto mt-24`}
      >
        <p className={style.plus}>❌ </p> poista tili
      </button>
    </div>
  );
};
