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

  const searchListsForUser = async (userId) => {
    if (!userId) alert("No user id");
    try {
      const usersCollectionRef = collection(db, "users");

      const q = query(usersCollectionRef, userId);
      const querySnapshot = await getDocs(q);

      if (querySnapshot.size === 1) {
        const userData = querySnapshot.docs[0].data();

        if (userData && "lists" in userData) {
          const userLists = userData.lists;

          return userLists;
        }
      }
    } catch (error) {
      console.log("Error getting document:", error);
    }
  };

  const handleSearchListsForUser = async () => {
    try {
      const userLists = await searchListsForUser(userId);

      setItems(userLists);
    } catch (error) {
      console.log(error);
    }
  };

  const searchListsByIds = async (listIds) => {
    try {
      const q = query(collection(db, "lists"), listIds);
      const querySnapshot = await getDocs(q);

      const listsData = querySnapshot.docs.map((doc) => doc.data());

      setLists(listsData);
    } catch (error) {
      console.log("Error: ", error);
      return null;
    }
  };

  const getCurrentUserNickname = async () => {
    try {
      const user = auth.currentUser;

      if (!user) {
        console.log("No user");
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
      } else {
        // User is signed out
        // ...
      }
    });

    return () => {
      unsubscribe();
    };
  }, []);

  const addNewList = async (name) => {
    try {
      const newListRef = collection(db, "lists");
      const newListDocRef = await addDoc(newListRef, {
        name: name,
        owner: userId,
      });

      // Wait for the nickname before proceeding
      const userNickname = await getCurrentUserNickname();

      await updateDoc(newListDocRef, { id: newListDocRef.id });

      // subcollection for list items
      const itemsCollectionRef = collection(newListDocRef, "items");
      await addDoc(itemsCollectionRef, { text: "testi", completed: false });

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
          const userLists = [newListDocRef.id];
          await setDoc(userDocRef, { userLists }, { merge: true });

          searchListsByIds(userLists);
        } else {
          const userLists = userData.lists;
          userLists.push(newListDocRef.id);
          await updateDoc(userDocRef, { lists: userLists }, { merge: true });

          searchListsByIds(userLists);
        }
      } else {
        console.log("No such document!");
      }

      console.log("New list added");
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (userId) {
      handleSearchListsForUser();
    }
  }, [userId]);

  useEffect(() => {
    searchListsByIds(items);
  }, [items]);

  return (
    <div className={homeStyle.container}>
      <HomeHeader
        newListMenu={newListMenu}
        setNewListMenu={setNewListMenu}
        toggleNewListMenu={toggleNewListMenu}
      ></HomeHeader>
      {newListMenu && <NewList addNewList={addNewList}></NewList>}
      <main className={homeStyle.main}>
        <ul className={homeStyle.lists}>
          {lists.length > 0 ? (
            lists.map((list) => (
              <ListElement key={list.id} name={list.name} id={list.id} />
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
