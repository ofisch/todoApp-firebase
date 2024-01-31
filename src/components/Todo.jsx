import React from "react";
import { FaRegTrashAlt } from "react-icons/fa";

const style = {
  li: `flex justify-between border w-full bg-dogwood p-4 my-2 cursor-pointer`,
  liComplete: `flex justify-between border bg-blue p-4 my-2 cursor-pointer`,
  row: `flex overflow-auto`,
  text: `ml-2 cursor-pointer`,
  textComplete: `ml-2 cursor-pointer line-through`,
  button: `cursor-pointer flex items-center`,
  check: "my-auto",
  garbage: `transition ease-in-out delay-70 hover:scale-130 duration-70`,
};

export const Todo = ({ todo, toggleComplete, editTodo, deleteTodo }) => {
  const [todoText, setTodoText] = React.useState(todo.text);
  const [isEditing, setIsEditing] = React.useState(false);

  const handleKeyPress = async (e) => {
    if (e.key === "Enter") {
      await editTodo(todo.id, todoText);
      setIsEditing(false);
    }
  };

  return (
    <li
      onClick={() => toggleComplete(todo)}
      className={todo.completed ? style.liComplete : style.li}
    >
      <div className={style.row}>
        <input
          onChange={() => toggleComplete(todo)}
          type="checkbox"
          checked={todo.completed ? "checked" : ""}
          className={style.check}
        />
        {isEditing ? (
          <input
            type="text"
            value={todoText}
            onChange={(e) => setTodoText(e.target.value)}
            onKeyPress={handleKeyPress}
            className={style.text}
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
        <button onClick={() => setIsEditing(true)}>
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
