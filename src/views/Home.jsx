import React, { useContext, useEffect, useRef, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { auth, db } from "../firebase";

import { logout } from "../utils/utils";
import { useNavigate } from "react-router-dom";

import { homeStyle } from "../styles/homeStyle";
import {
  QuerySnapshot,
  addDoc,
  collection,
  doc,
  getDoc,
  getDocs,
  onSnapshot,
  query,
  setDoc,
  updateDoc,
  where,
} from "firebase/firestore";
import { List } from "./List";
import { ListElement } from "../components/ListElement";
import { HomeHeader } from "../components/HomeHeader";
import { NewList } from "../components/NewList";

export const Home = () => {
  const user = useAuth();
  const navigate = useNavigate();
  // ylhäällä stickynä header, oikeella plussa jota painamalla voi luoda
  // tai liittyä uuteen listaan
  // headerissa kans logout ja vaik profiili-info (ehk nappi?)

  const [items, setItems] = useState([]);
  const [lists, setLists] = useState([]);
  const [email, setEmail] = useState("");
  const [userId, setUserId] = useState("");
  const [nickname, setNickname] = useState("");

  const [newListMenu, setNewListMenu] = useState(false);

  // jos listat on käyttäjällä tallessa ("lists")
  // voidaan hakea ne lists-collectionista id:n perusteella

  // haetaan eka käyttäjän listat (id),
  // tallennetaan ne ja haetaan firestoresta niillä id:eillä oikeet listat
  // ja luetellaan ul:ään

  const toggleNewListMenu = () => {
    setNewListMenu(!newListMenu);
  };

  // TODO: haetaan vain listat, joissa käyttäjä on jäsenenä

  const fetchUserLists = async () => {
    try {
      const user = auth.currentUser;

      console.log("user:", user.uid);

      if (!user) {
        console.log("No user");
        return;
      }

      const userDocRef = doc(db, "users", user.uid);
      const userDocSnapshot = await getDoc(userDocRef);

      if (userDocSnapshot.exists()) {
        const userData = userDocSnapshot.data();

        if (userData && "lists" in userData) {
          const userLists = userData.lists;

          // Fetch lists data
          const listsQuery = query(
            collection(db, "lists"),
            where("id", "in", userLists)
          );
          const listsSnapshot = await getDocs(listsQuery);

          const listsData = listsSnapshot.docs.map((listDoc) => ({
            id: listDoc.id,
            ...listDoc.data(),
          }));

          // Set lists to items state
          setItems(listsData);
        }
      }
    } catch (error) {
      console.log("Error fetching user lists:", error);
    }
  };

  const getCurrentUserNickname = async () => {
    try {
      const user = auth.currentUser;

      if (!user) {
        alert("No user");
        return null;
      }

      const userDocRef = doc(db, "users", user.uid);

      const userDocSnapshot = await getDoc(userDocRef);

      if (userDocSnapshot.exists()) {
        const userData = userDocSnapshot.data();
        return userData.nickname;
      } else {
        console.log("No such document!");
        return null;
      }
    } catch (error) {
      console.log("Error getting document:", error);
      return null;
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUserId(user.uid);
        setEmail(user.email);
        setNickname(getCurrentUserNickname().then((nickname) => nickname));
        fetchUserLists();
      } else {
        // User is signed out
        // ...
      }
    });

    return () => {
      unsubscribe();
    };
  }, []);

  const addNewList = async (icon, name) => {
    try {
      const newListRef = collection(db, "lists");
      const newListDocRef = await addDoc(newListRef, {
        icon: icon,
        name: name,
        owner: userId,
      });

      // Wait for the nickname before proceeding
      const userNickname = await getCurrentUserNickname();

      await updateDoc(newListDocRef, { id: newListDocRef.id });

      // subcollection for list items
      //const itemsCollectionRef = collection(newListDocRef, "items");
      //await addDoc(itemsCollectionRef, { text: "testi", completed: false });

      // subcollection for list members
      const membersCollectionRef = collection(newListDocRef, "members");
      const newMemberDocRef = doc(membersCollectionRef, auth.currentUser.uid);

      await setDoc(newMemberDocRef, {
        email: email,
        nickname: userNickname,
      });

      // add list to user's lists
      const userDocRef = doc(db, "users", userId);
      const userDocSnapshot = await getDoc(userDocRef);

      if (userDocSnapshot.exists()) {
        const userData = userDocSnapshot.data();
        // if user doesn't have lists yet, create an empty array
        if (!("lists" in userData)) {
          const lists = [newListDocRef.id];
          await setDoc(userDocRef, { lists }, { merge: true });
        } else {
          const lists = userData.lists;
          lists.push(newListDocRef.id);
          await updateDoc(userDocRef, { lists: lists }, { merge: true });
        }
      } else {
        console.log("No such document!");
      }

      alert("✅ Uusi lista lisätty!");
      toggleNewListMenu();
      fetchUserLists();
    } catch (error) {
      console.log(error);
    }
  };

  const homeContainer = useRef(null);

  useEffect(() => {
    const handleClickOutsideMenu = (event) => {
      if (
        homeContainer.current &&
        !homeContainer.current.contains(event.target)
      ) {
        // Click outside the menu, close it
        setNewListMenu(false);
      }
    };

    // Add global click event listener
    document.addEventListener("mousedown", handleClickOutsideMenu);

    return () => {
      // Cleanup the event listener when the component unmounts
      document.removeEventListener("mousedown", handleClickOutsideMenu);
    };
  }, [newListMenu]);

  return (
    <div className={homeStyle.container} ref={homeContainer}>
      <HomeHeader
        newListMenu={newListMenu}
        setNewListMenu={setNewListMenu}
        toggleNewListMenu={toggleNewListMenu}
        userId={userId}
        fetchUserLists={fetchUserLists}
      ></HomeHeader>
      {newListMenu && <NewList addNewList={addNewList}></NewList>}
      <main className={homeStyle.main}>
        <ul className={homeStyle.lists}>
          {items.length > 0 ? (
            items.map((list) => (
              <ListElement
                key={list.id}
                icon={list.icon}
                name={list.name}
                id={list.id}
              />
            ))
          ) : (
            <p>
              Ei listoja -{" "}
              <button onClick={toggleNewListMenu} className={homeStyle.link}>
                lisää uusi
              </button>{" "}
            </p>
          )}
        </ul>
      </main>
    </div>
  );
};
