import React from "react";
import { modalStyle } from "../../styles/modalStyle";

export const HistoryModalList = ({
  toggleMembersMode,
  toggleShowMembers,
  listLog,
}) => {
  return (
    <>
      <div className={modalStyle.menu}>
        <div className="flex gap-4 items-baseline">
          <h2 className="text-2xl font-bold mb-4 overflow-auto">Historia</h2>
          <button
            onClick={() => {
              toggleMembersMode();
            }}
            className={modalStyle.link}
          >
            Jäsenet
          </button>
        </div>
        <button onClick={toggleShowMembers} className={modalStyle.closeButton}>
          X
        </button>
      </div>
      {!listLog ? (
        <p>Ei muokkaushistoriaa</p>
      ) : (
        <ul className={modalStyle.ul}>
          {listLog.map((log, index) => (
            <li
              className={"my-4 overflow-auto bg-dogwood rounded-md p-2"}
              key={index}
            >
              {log}
            </li>
          ))}
        </ul>
      )}
    </>
  );
};
