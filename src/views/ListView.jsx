import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  onSnapshot,
  updateDoc,
  where,
} from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { db } from "../firebase";
import { listStyle } from "../styles/listStyle";
import Todo from "../components/Todo";
import { useParams } from "react-router-dom";

export const ListView = () => {
  const [items, setItems] = useState([]);
  const [input, setInput] = useState("");

  const { id } = useParams();

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
      alert("Please enter a valid todo");
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
        "❗ poistettuja ostoksia ei voi palauttaa, tyhjennetäänkö lista?"
      )
    ) {
      const listDocRef = doc(db, "lists", id);
      await updateDoc(listDocRef, {
        items: [],
      });
    }
  };

  return (
    <div className={listStyle.bg}>
      <div className={listStyle.container}>
        <h1 className={listStyle.heading}>
          <p className={listStyle.plus}>🍉</p>ostoslista id: {id}
        </h1>
        <form onSubmit={createTodo} className={listStyle.form}>
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className={listStyle.input}
            type="text"
            placeholder="lisää ostos"
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
        <div class={listStyle.bottom}>
          {items.length < 1 ? null : (
            <>
              <p className={listStyle.count}>{`${items.length} ostosta`}</p>
              <button className={listStyle.deleteAllButton} onClick={deleteAll}>
                <p className={listStyle.plus}>❌ </p> tyhjennä lista
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
