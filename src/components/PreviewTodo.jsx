import React, { useEffect, useState } from "react";
import { FaRegTrashAlt } from "react-icons/fa";

const style = {
  li: `flex justify-between border w-full bg-dogwood p-4 my-2`,
  liComplete: `flex justify-between border bg-blue p-4 my-2`,
  row: `flex`,
  text: `ml-2 cursor-pointer`,
  textComplete: `ml-2 cursor-pointer line-through`,
  button: `cursor-pointer flex items-center`,
  check: "my-auto",
  garbage: `transition ease-in-out delay-70 hover:scale-130 duration-70`,
};

export const PreviewTodo = ({ text, complete }) => {
  const [completed, setCompleted] = useState(complete);

  const toggleComplete = () => {
    setCompleted(!completed);
  };

  return (
    <li className={completed ? style.liComplete : style.li}>
      <div className={style.row}>
        <input
          onChange={() => toggleComplete()}
          type="checkbox"
          checked={completed ? "checked" : ""}
          className={style.check}
        />
        <p
          onClick={() => toggleComplete()}
          className={completed ? style.textComplete : style.text}
        >
          {text}
        </p>
      </div>
      <button>
        <p className={style.garbage}>🗑️</p>
      </button>
    </li>
  );
};

export default PreviewTodo;
