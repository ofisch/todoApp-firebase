import React, { useState } from "react";

export const LandingPoint = ({ header, text }) => {
  const style = {
    point: `flex flex-col shadow-md text-center gap-4 rounded-b-md p-4 items-center justify-center w-full h-full`,
    h2: `text-darkblue text-2xl font-bold `,
    checkHeader: `flex text-center`,
    check: `my-auto w-6 h-6`,
    pointChecked: `bg-blue line-through`,
  };

  const [completed, setCompleted] = useState(false);

  const toggleComplete = (todo) => {
    setCompleted(!completed);
  };

  return (
    <div
      className={`${style.point} ${
        completed ? style.pointChecked : "bg-dogwood"
      }`}
    >
      <div className={style.checkHeader}>
        <input
          onChange={toggleComplete}
          type="checkbox"
          checked={completed}
          className={style.check}
        />
        <h2 className={style.h2}>{header}</h2>
      </div>

      <p>{text}</p>
    </div>
  );
};
