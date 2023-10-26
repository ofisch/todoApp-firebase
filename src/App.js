import { useState, useEffect } from "react";
import "./App.css";
import { AiOutlinePlus } from "react-icons/ai";
import Todo from "./Todo";
import { db } from "./firebase";
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

const style = {
  bg: `h-screen w-screen bg-jade font-quicksand`,
  container: `max-w-[500px] w-full m-auto rounded-md p-4`,
  heading: `text-3xl flex font-bold text-black py-2`,
  form: `flex justify-between`,
  input: `border p-2 w-full text-xl`,
  button: `border p-4 ml-2 bg-pink text-slate-100`,
  plus: `transition ease-in-out delay-70 hover:scale-130 duration-70`,
  bottom: `flex flex-col items-center gap-2`,
  count: `text-center p-2`,
  deleteAllButton: `flex border p-4 bg-pink`,
  info: `mt-5`,
  link: `text-pink bg-dogwood font-bold`,
};

function App() {
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
    <div className={style.bg}>
      <div className={style.container}>
        <h1 className={style.heading}>
          <p className={style.plus}>🍉</p>ostoslista
        </h1>
        <form onSubmit={createTodo} className={style.form}>
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className={style.input}
            type="text"
            placeholder="lisää ostos"
          ></input>
          <button className={style.button}>
            <p className={style.plus}>➕</p>
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
        <div class={style.bottom}>
          {items.length < 1 ? null : (
            <>
              <p className={style.count}>{`${items.length} ostosta`}</p>
              <button className={style.deleteAllButton} onClick={deleteAll}>
                <p className={style.plus}>❌ </p> tyhjennä lista
              </button>
            </>
          )}
          <p className={style.info}>
            by{" "}
            <a className={style.link} href="https://github.com/ofisch">
              onni
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}

export default App;
