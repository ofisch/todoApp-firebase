import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  onSnapshot,
  query,
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

export const ListView = () => {
  const [items, setItems] = useState([]);
  const [input, setInput] = useState("");
  const [listInfo, setListInfo] = useState({});

  const { id } = useParams();

  const navigate = useNavigate();

  // TODO: hae listan nimi ja ikoni bäkkäristä
  // ja tulosta otsikkoon

  // tarkistetaan käyttäjän sessio, jotta url-osoitteen kautta ei pääse katsomaan listaa
  const checkUserSession = async () => {
    const user = auth.currentUser;
    try {
      if (!user) {
        navigate("/home");
        return;
      }
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

  const deleteTodo = async (todoId) => {
    try {
      const itemDocRef = doc(db, "lists", id, "items", todoId);

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
      itemsSnapshot.forEach((item) => {
        deleteTodo(item.id);
      });
    }
  };

  // jäsenten näyttäminen

  const [members, setMembers] = useState([]);
  const [showMembers, setShowMembers] = useState(false);
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

  useEffect(() => {
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

    if (showMembers) {
      fetchMembers();
      getListOwnerNickname();
    }
  }, [showMembers, id]);

  const toggleShowMembers = () => {
    setShowMembers(!showMembers);
  };

  const listElementRef = useRef(null);

  useEffect(() => {
    const handleClickOutsideModal = (event) => {
      if (
        listElementRef.current &&
        !listElementRef.current.contains(event.target)
      ) {
        // Click outside the modal, close it
        setShowMembers(false);
      }
    };

    // Add global click event listener
    document.addEventListener("mousedown", handleClickOutsideModal);

    return () => {
      // Cleanup the event listener when the component unmounts
      document.removeEventListener("mousedown", handleClickOutsideModal);
    };
  }, []);

  return (
    <div className={listStyle.bg}>
      <div className={listStyle.container} ref={listElementRef}>
        <div className="flex  justify-between">
          <h1 className={listStyle.heading}>
            <p className={listStyle.plus}>{listInfo.icon}</p>
            {listInfo.name}
          </h1>
          <button onClick={toggleShowMembers} className="mr-4 scale-125">
            <p className={listStyle.plus}>👥</p>
          </button>
        </div>
        <form onSubmit={createTodo} className={listStyle.form}>
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className={listStyle.input}
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
        </div>
      </div>
      {showMembers && <MembersModal members={members} ownerId={ownerId} />}
    </div>
  );
};
