import React, { useContext, useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { auth, db } from "../firebase";

import { logout } from "../utils/utils";
import { useNavigate } from "react-router-dom";

import { homeStyle } from "../styles/homeStyle";
import {
  QuerySnapshot,
  collection,
  doc,
  getDoc,
  getDocs,
  query,
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

  const [newListMenu, setNewListMenu] = useState(false);

  // jos listat on käyttäjällä tallessa ("lists")
  // voidaan hakea ne lists-collectionista id:n perusteella

  // haetaan eka käyttäjän listat (id),
  // tallennetaan ne ja haetaan firestoresta niillä id:eillä oikeet listat
  // ja luetellaan ul:ään

  const toggleNewListMenu = () => {
    console.log("newListMenu: ", newListMenu);
    setNewListMenu(!newListMenu);
  };

  const searchListsForUser = async (userId) => {
    if (!userId) alert("No user id");
    try {
      const usersCollectionRef = collection(db, "users");

      const q = query(usersCollectionRef, where("id", "==", userId));
      const querySnapshot = await getDocs(q);

      if (querySnapshot.size === 1) {
        const userData = querySnapshot.docs[0].data();

        if (userData && "lists" in userData) {
          const userLists = userData.lists;
          console.log("lists: ", userLists);
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
      console.log(userLists);
      setItems(userLists);
      console.log("items: ", items);
    } catch (error) {
      console.log(error);
    }
  };

  const searchListsByIds = async (listIds) => {
    try {
      const q = query(collection(db, "lists"), where("id", "in", listIds));
      const querySnapshot = await getDocs(q);

      const listsData = querySnapshot.docs.map((doc) => doc.data());

      console.log("listsData: ", listsData);
      setLists(listsData);
    } catch (error) {
      console.log("Error: ", error);
      return null;
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUserId(user.uid);
        setEmail(user.email);
        console.log("id: ", user.uid);
        console.log("nick: ", user.nickname);
      } else {
        // User is signed out
        // ...
      }
    });

    return () => unsubscribe();
  }, []);

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
      {newListMenu && <NewList></NewList>}
      <main className={homeStyle.main}>
        <ul className={homeStyle.lists}>
          {lists.map((list) => (
            <ListElement key={list.id} name={list.name} />
          ))}
        </ul>
      </main>
    </div>
  );
};
