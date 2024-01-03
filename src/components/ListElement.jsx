import React from "react";

const style = {
  li: `flex justify-between border bg-dogwood p-4 my-2`,
  liComplete: `flex justify-between border bg-blue p-4 my-2`,
  row: `flex`,
  text: `ml-2 cursor-pointer`,
  textComplete: `ml-2 cursor-pointer line-through`,
  button: `cursor-pointer flex items-center`,
  members: `transition ease-in-out delay-70 hover:scale-130 duration-70`,
};

export const ListElement = ({ name }) => {
  return (
    <li className={style.li}>
      <div className={style.row}>
        <p className={style.text}>{name}</p>
      </div>
      <button>
        <p className={style.members}>👤</p>
      </button>
    </li>
  );
};
