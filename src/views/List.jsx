import React from "react";
import { useState, useEffect } from "react";
import Todo from "../components/Todo";
import { db } from "../firebase";
import {
  query,
  collection,
  onSnapshot,
  QuerySnapshot,
  updateDoc,
  doc,
  addDoc,
  deleteDoc,
} from "firebase/firestore";

import { listStyle } from "../styles/listStyle";

export const List = () => {
  const [items, setItems] = useState([]);
  const [input, setInput] = useState("");

  // create item
  const createTodo = async (e) => {
    e.preventDefault(e);
    if (input === "") {
      alert("Please enter  a valid todo");
      return;
    }
    await addDoc(collection(db, "items"), {
      text: input,
      completed: false,
    });
    setInput("");
  };

  // read items from Firebase
  useEffect(() => {
    const q = query(collection(db, "items"));
    const unsubscribe = onSnapshot(q, (QuerySnapshot) => {
      let itemsArr = [];
      QuerySnapshot.forEach((doc) => {
        itemsArr.push({ ...doc.data(), id: doc.id });
      });
      setItems(itemsArr);
    });
    return () => unsubscribe();
  }, []);
  // update todo in Firebase
  const toggleComplete = async (todo) => {
    await updateDoc(doc(db, "items", todo.id), {
      completed: !todo.completed,
    });
  };

  // delete todo
  const deleteTodo = async (id) => {
    await deleteDoc(doc(db, "items", id));
  };

  // delete all
  const deleteAll = async () => {
    if (
      window.confirm(
        "❗ poistettuja ostoksia ei voi palauttaa, tyhjennetäänkö lista?"
      )
    ) {
      const q = query(collection(db, "items"));
      const unsub = onSnapshot(q, (QuerySnapshot) => {
        QuerySnapshot.forEach((doc) => {
          deleteTodo(doc.id);
          window.location.reload();
        });
      });
    } else {
    }
  };

  return (
    <div className={listStyle.bg}>
      <div className={listStyle.container}>
        <h1 className={listStyle.heading}>
          <p className={listStyle.plus}>🍉</p>ostoslista
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
          {items.map((todo, index) => (
            <Todo
              key={index}
              todo={todo}
              toggleComplete={toggleComplete}
              deleteTodo={deleteTodo}
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
          <p className={listStyle.info}>
            by{" "}
            <a className={listStyle.link} href="https://github.com/ofisch">
              onni
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};
