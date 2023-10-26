import React from "react";
import { FaRegTrashAlt } from "react-icons/fa";

const style = {
  li: `flex justify-between border bg-dogwood p-4 my-2`,
  liComplete: `flex justify-between border bg-blue p-4 my-2`,
  row: `flex`,
  text: `ml-2 cursor-pointer`,
  textComplete: `ml-2 cursor-pointer line-through`,
  button: `cursor-pointer flex items-center`,
  garbage: `transition ease-in-out delay-70 hover:scale-130 duration-70`,
};

export const Todo = ({ todo, toggleComplete, deleteTodo }) => {
  return (
    <li className={todo.completed ? style.liComplete : style.li}>
      <div className={style.row}>
        <input
          onChange={() => toggleComplete(todo)}
          type="checkbox"
          checked={todo.completed ? "checked" : ""}
        />
        <p
          onClick={() => toggleComplete(todo)}
          className={todo.completed ? style.textComplete : style.text}
        >
          {todo.text}
        </p>
      </div>
      <button onClick={() => deleteTodo(todo.id)}>
        <p className={style.garbage}>🗑️</p>
      </button>
    </li>
  );
};

export default Todo;
