import React, { useEffect } from "react";
import { FaRegTrashAlt } from "react-icons/fa";

const style = {
  li: `flex justify-between border w-full p-4 my-2 cursor-pointer`,
  liComplete: `flex justify-between border bg-blue p-4 my-2 cursor-pointer`,
  row: `flex overflow-auto`,
  text: `ml-2 cursor-pointer`,
  textComplete: `ml-2 cursor-pointer line-through`,
  button: `cursor-pointer flex items-center`,
  check: "my-auto",
  garbage: `transition ease-in-out delay-70 hover:scale-130 duration-70`,
  input: "ml-2 border w-auto",
};

export const Todo = ({ todo, toggleComplete, editTodo, deleteTodo }) => {
  const [todoText, setTodoText] = React.useState(todo.text);
  const [todoEditedText, setTodoEditedText] = React.useState(todo.text);
  const [isEditing, setIsEditing] = React.useState(false);
  const inputRef = React.useRef(null);

  if (
    localStorage.getItem("listingColor") === null ||
    localStorage.getItem("listingColor") === "undefined"
  ) {
    localStorage.setItem("listingColor", "#D3BDB0");
  }

  const handleKeyPress = async (e) => {
    if (e.key === "Enter") {
      await editTodo(todo.id, todoEditedText);
      setIsEditing(false);
      setTodoEditedText(todo.text);
    } else if (e.key === "Escape") {
      setIsEditing(false);
      setTodoEditedText(todo.text);
    }
  };

  const toggleEditing = () => {
    setIsEditing(!isEditing);
    if (!isEditing) {
      setTodoEditedText(todo.text);
    }
  };

  useEffect(() => {
    if (isEditing) {
      inputRef.current.focus();
    }
  }, [isEditing]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      const isEditButtonClicked = e.target.closest("#edit-button");
      const isInputClicked = e.target.tagName === "INPUT";

      if (!isEditButtonClicked && !isInputClicked) {
        setIsEditing(false);
        setTodoEditedText(todo.text);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <li
      onClick={() => toggleComplete(todo)}
      className={todo.completed ? style.liComplete : style.li}
      style={{
        backgroundColor: todo.completed
          ? "#72A1E5"
          : localStorage.getItem("listingColor"),
      }}
    >
      <div className={style.row}>
        <input
          onChange={(e) => {
            e.stopPropagation();
            toggleComplete(todo);
          }}
          type="checkbox"
          checked={todo.completed ? "checked" : ""}
          className={style.check}
        />
        {isEditing ? (
          <input
            ref={inputRef}
            type="text"
            className={style.input}
            value={todoEditedText}
            onClick={(e) => e.stopPropagation()}
            onChange={(e) => {
              e.stopPropagation();
              setTodoEditedText(e.target.value);
            }}
            onKeyPress={handleKeyPress}
          />
        ) : (
          <p
            onClick={() => toggleComplete(todo)}
            className={todo.completed ? style.textComplete : style.text}
          >
            {todo.text}
          </p>
        )}
      </div>
      <div className="flex gap-4">
        <button
          id="edit-button"
          onClick={(e) => {
            e.stopPropagation();
            toggleEditing();
          }}
        >
          <p className={style.garbage}>✍️</p>
        </button>
        <button
          onClick={(e) => {
            e.stopPropagation();
            deleteTodo(todo.id);
          }}
        >
          <p className={style.garbage}>🗑️</p>
        </button>
      </div>
    </li>
  );
};

export default Todo;
