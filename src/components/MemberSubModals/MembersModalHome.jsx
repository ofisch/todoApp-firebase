import React from "react";
import { modalStyle } from "../../styles/modalStyle";

export const MembersModalHome = ({
  toggleShowMembers,
  sortedMembers,
  ownerNickname,
}) => {
  return (
    <>
      <div className={modalStyle.menu}>
        <h2 className="text-2xl font-bold mb-4 overflow-auto">Jäsenet</h2>
        <button
          onClick={(e) => {
            e.stopPropagation();
            toggleShowMembers();
          }}
          className={modalStyle.closeButton}
        >
          X
        </button>
      </div>

      <ul className={modalStyle.ul}>
        {sortedMembers.map((member, index) => (
          <li
            className={`w-fit my-2 bg-dogwood rounded-md p-2 overflow-auto`}
            key={member.email}
          >
            {member.nickname === ownerNickname ? (
              <span>👑{member.nickname}</span>
            ) : (
              <span>{member.nickname}</span>
            )}
          </li>
        ))}
      </ul>
    </>
  );
};
