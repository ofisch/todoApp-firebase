import {
  FieldValue,
  addDoc,
  arrayRemove,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  onSnapshot,
  query,
  setDoc,
  updateDoc,
  where,
} from "firebase/firestore";
import React, { useEffect, useRef, useState } from "react";
import { auth, db } from "../firebase";
import { listStyle } from "../styles/listStyle";
import Todo from "../components/Todo";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { MembersModal } from "../components/MembersModal";
import { InviteToListModal } from "../components/InviteToListModal";
import { onAuthStateChanged } from "firebase/auth";

export const ListView = () => {
  const [items, setItems] = useState([]);
  const [input, setInput] = useState("");
  const [listInfo, setListInfo] = useState({});

  const [userId, setUserId] = useState("");
  const [userNickname, setUserNickname] = useState("");

  const { id } = useParams();

  const navigate = useNavigate();

  // TODO: hae listan nimi ja ikoni bäkkäristä
  // ja tulosta otsikkoon

  // tarkistetaan käyttäjän sessio, jotta url-osoitteen kautta ei pääse katsomaan listaa
  const checkUserSession = async () => {
    const user = auth.currentUser;
    try {
      if (!user) {
        setUserId(null);

        return;
      }
      setUserId(user.uid);
    } catch (error) {
      console.error("Error checking user membership:", error);
    }
  };

  const getListInfo = async () => {
    try {
      const listDocRef = doc(db, "lists", id);
      const listDocSnapshot = await getDoc(listDocRef);

      if (listDocSnapshot.exists()) {
        setListInfo(listDocSnapshot.data());
      }
    } catch (error) {
      console.error("Error getting list info:", error);
    }
  };

  // haetaan itemit listan id:n perusteella
  const fetchItems = () => {
    try {
      const itemsCollectionRef = collection(db, "lists", id, "items");

      // Use onSnapshot to listen for real-time updates
      const unsubscribe = onSnapshot(itemsCollectionRef, (querySnapshot) => {
        const itemsArr = [];

        querySnapshot.forEach((itemDoc) => {
          itemsArr.push({ ...itemDoc.data(), id: itemDoc.id });
        });

        setItems(itemsArr);
      });

      return unsubscribe; // This will be used to unsubscribe when the component unmounts
    } catch (error) {
      console.error("Error fetching items:", error);
    }
  };

  useEffect(() => {
    checkUserSession();
    getListInfo();
    const unsubscribe = fetchItems(); // kutsutaan funktiota itemien hakemiseen

    return () => {
      // Cleanup the subscription when the component unmounts
      unsubscribe();
    };
  }, [id]);

  const addToLog = async (message) => {
    try {
      const listDocRef = doc(db, "lists", id);

      const listDocSnapshot = await getDoc(listDocRef);
      if (listDocSnapshot.exists()) {
        const currentLog = listDocSnapshot.data().log || [];

        // Add the new message to the log array
        const updatedLog = [message, ...currentLog];

        const limitedLog = updatedLog.slice(0, 30);

        // Update the document with the new log array
        await updateDoc(listDocRef, { log: limitedLog });
      } else {
        await setDoc(listDocRef, { log: [message] });

        console.log("List created with the first log message:", message);
      }
    } catch (error) {
      console.error("Error adding to log:", error);
    }
  };

  // create item
  const createTodo = async (e) => {
    e.preventDefault();
    if (input === "") {
      alert("Tyhjä listaus");
      return;
    }

    try {
      const itemsCollectionRef = collection(db, "lists", id, "items");
      await addDoc(itemsCollectionRef, {
        text: input,
        completed: false,
      });

      setInput("");

      // lisätään logiin tieto uudesta listauksesta
      addToLog("✅ " + userNickname + " lisäsi listauksen: " + input);
    } catch (error) {
      console.error("Error creating todo:", error);
    }
  };

  const toggleComplete = async (itemId) => {
    try {
      const itemDocRef = doc(db, "lists", id, "items", itemId);
      const itemDocSnapshot = await getDoc(itemDocRef);

      if (itemDocSnapshot.exists()) {
        const itemData = itemDocSnapshot.data();
        await updateDoc(itemDocRef, {
          completed: !itemData.completed,
        });
      } else {
        console.error("Item not found");
      }
    } catch (error) {
      console.error("Error toggling complete:", error);
    }
  };

  const deleteTodo = async (todoId, isBulkDeletion = false) => {
    try {
      const itemDocRef = doc(db, "lists", id, "items", todoId);

      const itemDocSnapshot = await getDoc(itemDocRef);

      const itemText = itemDocSnapshot.data().text;

      if (!isBulkDeletion) {
        addToLog("❌ " + userNickname + " poisti listauksen: " + itemText);
      }
      // Delete the document in the subcollection
      await deleteDoc(itemDocRef);
    } catch (error) {
      console.error("Error deleting todo:", error);
    }
  };

  const deleteAll = async () => {
    if (
      window.confirm(
        "❗ Poistettuja listauksia ei voi palauttaa, tyhjennetäänkö lista?"
      )
    ) {
      const itemsCollectionRef = collection(db, "lists", id, "items");
      const itemsSnapshot = await getDocs(itemsCollectionRef);

      // lisätään logiin tieto tyhjennetystä listasta
      addToLog("❗ " + userNickname + " tyhjensi listan");

      itemsSnapshot.forEach((item) => {
        deleteTodo(item.id, true);
      });
    }
  };

  const deleteListFromAllUsers = async (id) => {
    const usersCollectionRef = collection(db, "users");
    const usersSnapshot = await getDocs(usersCollectionRef);

    usersSnapshot.forEach(async (user) => {
      const userDocRef = doc(db, "users", user.id);
      const userDocSnapshot = await getDoc(userDocRef);

      if (userDocSnapshot.exists()) {
        const userData = userDocSnapshot.data();

        // Check if the user has a "lists" field and if it contains the list to be deleted
        if (userData.lists && userData.lists.includes(id)) {
          // Remove the list from the "lists" field
          const updatedLists = userData.lists.filter((listId) => listId !== id);

          // Update the user document with the modified "lists" field
          await updateDoc(userDocRef, { lists: updatedLists });
        }
      }
    });
  };

  const deleteList = async () => {
    const membersArray = [];
    const membersSnapshot = await getDocs(
      query(collection(db, "lists", id, "members"))
    );
    membersSnapshot.forEach((member) => {
      membersArray.push(member.data());
    });

    const nicknameInput = prompt("Syötä käyttäjätunnus jatkaaksesi");
    if (nicknameInput === userNickname) {
      if (
        window.confirm(
          `❗ Listalla on ${membersArray.length} jäsentä. Poistettua listaa ei voi palauttaa, poistetaanko lista?`
        )
      ) {
        const listDocRef = doc(db, "lists", id);
        // poistetaan lista jokaisen jäsenen listoista
        deleteListFromAllUsers(id);
        // poistetaan lista-doc
        await deleteDoc(listDocRef);
        navigate("/");
      }
    } else {
      alert("❌ Käyttäjätunnuksen vahvistaminen epäonnistui");
    }
  };

  // jäsenten näyttäminen

  const [members, setMembers] = useState([]);
  const [showMembers, setShowMembers] = useState(false);
  const [membersMode, setMembersMode] = useState(true);
  const [ownerId, setOwnerId] = useState("");

  const getListOwnerNickname = async () => {
    try {
      const listDocRef = doc(db, "lists", id);
      const listDocSnapshot = await getDoc(listDocRef);

      if (listDocSnapshot.exists()) {
        const listData = listDocSnapshot.data();
        setOwnerId(listData.owner);
      }
    } catch (error) {
      console.error("Error getting list owner:", error);
    }
  };

  const getListLog = async () => {
    try {
      const listDocRef = doc(db, "lists", id);
      const listDocSnapshot = await getDoc(listDocRef);

      if (listDocSnapshot.exists()) {
        const listData = listDocSnapshot.data();
        const log = listData.log || [];

        return log;
      }
    } catch (error) {
      console.error("Error getting list log:", error);
    }
  };

  const fetchMembers = async () => {
    const membersArray = [];
    const membersSnapshot = await getDocs(
      query(collection(db, "lists", id, "members"))
    );
    membersSnapshot.forEach((member) => {
      membersArray.push(member.data());
    });
    setMembers(membersArray);
  };

  useEffect(() => {
    if (showMembers) {
      fetchMembers();
      getListOwnerNickname();
    }
  }, [showMembers, id]);

  const toggleShowMembers = () => {
    setShowMembers(!showMembers);
  };

  const listElementRef = useRef(null);

  const [showInviteToListModal, setShowInviteToListModal] = useState(false);

  const toggleShowInviteToListModal = () => {
    setShowInviteToListModal(!showInviteToListModal);
  };

  useEffect(() => {
    const handleClickOutsideModal = (event) => {
      if (
        listElementRef.current &&
        !listElementRef.current.contains(event.target)
      ) {
        // Click outside the modal, close it
        setShowMembers(false);
        setMembersMode(true);
        setShowInviteToListModal(false);
      }
    };

    // Add global click event listener
    document.addEventListener("mousedown", handleClickOutsideModal);

    return () => {
      // Cleanup the event listener when the component unmounts
      document.removeEventListener("mousedown", handleClickOutsideModal);
    };
  }, []);

  // listView.jsx:ssä käytettävät funktiot

  const getUserNicknameById = async (userId) => {
    try {
      const userDocRef = doc(db, "users", userId);
      const userDocSnapshot = await getDoc(userDocRef);

      if (userDocSnapshot.exists()) {
        const userData = userDocSnapshot.data();
        return userData.nickname;
      } else {
        console.log("User not found");
        return null;
      }
    } catch (error) {
      console.error("Error getting user nickname:", error);
      return null;
    }
  };

  const getUserIdByNickname = async (nickname) => {
    try {
      const usersCollectionRef = collection(db, "users");
      const usersQuery = query(
        usersCollectionRef,
        where("nickname", "==", nickname)
      );

      const usersQuerySnapshot = await getDocs(usersQuery);

      if (usersQuerySnapshot.empty) {
        console.log("No matching users");
        return null;
      } else {
        const userId = usersQuerySnapshot.docs[0].id;
        return userId;
      }
    } catch (error) {
      console.error("Error getting user id:", error);
      return null;
    }
  };

  const leaveList = async (listId, userId) => {
    try {
      // Update the list's "members" collection
      const listRef = doc(db, "lists", listId);

      const membersCollectionRef = collection(listRef, "members");

      // Delete the specific member document with the userId as the key
      await deleteDoc(doc(membersCollectionRef, userId));

      // Update the user's "lists" field
      const userRef = doc(db, "users", userId);
      const userDoc = await getDoc(userRef);

      if (userDoc.exists()) {
        const userData = userDoc.data();
        if (userData.lists && userData.lists.includes(listId)) {
          await updateDoc(userRef, {
            lists: arrayRemove(listId),
          });
        }
      }

      alert("Poistuit listalta");
      navigate("/");
    } catch (error) {
      console.error("Error: ", error);
    }
  };

  useEffect(() => {
    getListOwnerNickname();
  }, []);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setUserId(user.uid);
        const nickname = await getUserNicknameById(user.uid);
        setUserNickname(nickname);
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

  return (
    <div className={listStyle.container} ref={listElementRef}>
      <div className="flex  justify-between items-center sticky top-0 bg-jade z-50">
        <h1 className={listStyle.heading}>
          <p className={listStyle.plus}>{listInfo.icon}</p>
          {listInfo.name}
        </h1>
        <div className={listStyle.buttons}>
          <button onClick={toggleShowMembers} className="">
            <p className={listStyle.plus}>👥</p>
          </button>
          <button onClick={toggleShowInviteToListModal}>
            <p className={listStyle.plus}>🔗</p>
          </button>
        </div>
      </div>
      <form onSubmit={createTodo} className={listStyle.form}>
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className={listStyle.input}
          spellCheck="false"
          type="text"
          placeholder="lisää listaus"
        ></input>
        <button className={listStyle.button}>
          <p className={listStyle.plus}>➕</p>
        </button>
      </form>
      <ul>
        {items.map((todo) => (
          <Todo
            key={todo.id}
            todo={todo}
            toggleComplete={() => toggleComplete(todo.id)}
            deleteTodo={() => deleteTodo(todo.id)}
          />
        ))}
      </ul>
      <div className={listStyle.bottom}>
        {items.length < 1 ? null : (
          <>
            <p className={listStyle.count}>
              {items.length > 1
                ? `${items.length} listausta`
                : `${items.length} listaus`}
            </p>
            <button className={listStyle.deleteAllButton} onClick={deleteAll}>
              <p className={listStyle.plus}>❌ </p> tyhjennä lista
            </button>
          </>
        )}
        {ownerId === userId && items.length === 0 && (
          <button onClick={deleteList} className="absolute bottom-9">
            <p className={listStyle.deleteListIcon}>🗑️</p>
            <span className={listStyle.link}> poista lista</span>
          </button>
        )}
      </div>
      {showMembers && (
        <MembersModal
          members={members}
          ownerId={ownerId}
          membersMode={membersMode}
          setMembersMode={setMembersMode}
          getListLog={getListLog}
          listId={id}
          userId={userId}
          leaveList={leaveList}
        />
      )}
      {showInviteToListModal && (
        <InviteToListModal
          ownerId={ownerId}
          listInfo={listInfo}
          getUserNicknameById={getUserNicknameById}
          getUserIdByNickname={getUserIdByNickname}
          toggleShowInviteToListModal={toggleShowInviteToListModal}
        />
      )}
    </div>
  );
};
