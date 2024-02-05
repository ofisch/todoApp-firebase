import React from "react";
import { modalStyle } from "../../styles/modalStyle";

export const MembersModalList = ({
  toggleMembersMode,
  toggleShowMembers,
  sortedMembers,
  ownerNickname,
  ownerId,
  auth,
  leaveList,
  removeUser,
  listId,
  userId,
}) => {
  const user = auth.currentUser;

  return (
    <>
      <div className={modalStyle.menu}>
        <div className="flex gap-4 items-baseline">
          <h2 className="text-2xl font-bold mb-4 overflow-auto">Jäsenet</h2>
          <button onClick={toggleMembersMode} className={modalStyle.link}>
            Historia
          </button>
        </div>
        <button onClick={toggleShowMembers} className={modalStyle.closeButton}>
          X
        </button>
      </div>
      <div>
        <ul className={modalStyle.ul}>
          {sortedMembers.map((member, index) => (
            <li
              className={`w-fit my-2 bg-dogwood rounded-md p-2 overflow-auto `}
              key={member.email}
            >
              {member.nickname === ownerNickname ? (
                <span>👑{member.nickname}</span>
              ) : (
                <span>
                  {member.nickname}{" "}
                  {ownerId === user.uid ? (
                    <button onClick={() => removeUser(listId, member.nickname)}>
                      ❌
                    </button>
                  ) : (
                    ""
                  )}
                </span>
              )}
            </li>
          ))}
        </ul>
        {ownerId !== auth.currentUser.uid && (
          <button
            onClick={() => leaveList(listId, userId)}
            className={modalStyle.button}
          >
            poistu listalta
          </button>
        )}
      </div>
    </>
  );
};
