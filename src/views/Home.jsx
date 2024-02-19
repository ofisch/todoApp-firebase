import React, { useContext, useEffect, useRef, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { auth, db } from "../firebase";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";

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

  const firstVisit = localStorage.getItem("firstVisit");

  if (!firstVisit) {
    localStorage.setItem("firstVisit", "true");
  }

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

  const fetchUserLists = async () => {
    try {
      const user = auth.currentUser;

      if (!user) {
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

          // Create a map for quick access to list data by ID
          const listsDataMap = new Map(
            listsSnapshot.docs.map((listDoc) => [
              listDoc.id,
              { id: listDoc.id, ...listDoc.data() },
            ])
          );

          // Set lists to items state

          const sortedListsData = userLists.map((listId) =>
            listsDataMap.get(listId)
          );

          setItems(sortedListsData);
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
        localStorage.setItem("nickname", userData.nickname);
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
    if (localStorage.getItem("firstVisit") === "true") {
      navigate("/landing");
    }
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUserId(user.uid);
        setEmail(user.email);
        setNickname(getCurrentUserNickname().then((nickname) => nickname));
        fetchUserLists();
      } else {
        // User is signed out
        // ...
        navigate("/login");
      }
    });

    return () => {
      unsubscribe();
    };
  }, []);

  const addNewList = async (icon, name) => {
    try {
      if (name === "") {
        alert("❗️ Listan nimi ei voi olla tyhjä!");
        return;
      }

      const newListRef = collection(db, "lists");
      const newListDocRef = await addDoc(newListRef, {
        icon: icon,
        name: name,
        bgColor: localStorage.getItem("color") || "#04A777",
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

  const getUserTheme = async () => {
    const user = auth.currentUser;

    if (!user) {
      console.log("No user");
      return;
    }

    const userDocRef = doc(db, "users", user.uid);
    const userDocSnapshot = await getDoc(userDocRef);

    if (userDocSnapshot.exists()) {
      const userData = userDocSnapshot.data();

      // jos käyttäjällä on väri tallennettuna, käytetään sitä
      if (userData && "color" in userData === localStorage.getItem("color")) {
        return localStorage.getItem("color");
      }

      // jos ei, käytetään firestoresta haettua väriä
      if (userData && "color" in userData) {
        localStorage.setItem("color", userData.color);
        return userData.color;
      }
    }
  };

  let color;

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        getUserTheme().then((color) => {
          if (color) {
            document.body.style = "";
            document.body.style.backgroundColor = color;
          }
        });
      }
    });

    return () => {
      unsubscribe();
    };
  }, []);

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

  const saveReorderedList = async (reorderedItems) => {
    try {
      const user = auth.currentUser;

      if (!user) {
        return;
      }

      const userDocRef = doc(db, "users", user.uid);
      const userDocSnapshot = await getDoc(userDocRef);

      if (userDocSnapshot.exists()) {
        // Construct an array of list IDs in the new order
        const reorderedListIds = reorderedItems.map((item) => item.id);

        // Update user's document with the reordered list
        await updateDoc(userDocRef, {
          lists: reorderedListIds,
        });
      }
    } catch (error) {
      console.log("Error saving reordered list:", error);
    }
  };

  // Function to handle drag-and-drop reorder
  const onDragEnd = (result) => {
    if (!result.destination) return; // dropped outside the list
    const reorderedItems = Array.from(items);
    const [reorderedItem] = reorderedItems.splice(result.source.index, 1);
    reorderedItems.splice(result.destination.index, 0, reorderedItem);
    setItems(reorderedItems);
    // Call function to save reordered list to Firestore
    saveReorderedList(reorderedItems);
  };

  return (
    <div className={`${homeStyle.container} bg-${color}`} ref={homeContainer}>
      <HomeHeader
        newListMenu={newListMenu}
        setNewListMenu={setNewListMenu}
        toggleNewListMenu={toggleNewListMenu}
        userId={userId}
        nickname={nickname}
        getCurrentUserNickname={getCurrentUserNickname}
        fetchUserLists={fetchUserLists}
      ></HomeHeader>
      {newListMenu && (
        <NewList
          addNewList={addNewList}
          toggleNewListMenu={toggleNewListMenu}
        ></NewList>
      )}
      <main className={homeStyle.main}>
        <DragDropContext onDragEnd={onDragEnd}>
          <ul className={homeStyle.lists}>
            <Droppable droppableId="lists">
              {(provided) => (
                <div ref={provided.innerRef} {...provided.droppableProps}>
                  {items.length > 0 ? (
                    items.map((list, index) => (
                      <Draggable
                        key={list.id}
                        draggableId={list.id}
                        index={index}
                      >
                        {(provided) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                          >
                            <ListElement
                              key={list.id}
                              icon={list.icon}
                              name={list.name}
                              id={list.id}
                              fetchUserLists={fetchUserLists}
                              userId={userId}
                            />
                          </div>
                        )}
                      </Draggable>
                    ))
                  ) : (
                    <p>No items</p>
                  )}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </ul>
        </DragDropContext>
      </main>
    </div>
  );
};
