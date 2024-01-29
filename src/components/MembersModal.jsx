import {
  arrayRemove,
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  updateDoc,
} from "firebase/firestore";
import React, { useEffect, useState } from "react";

import { auth, db } from "../firebase";
import { useLocation } from "react-router-dom";

export const MembersModal = ({
  members,
  ownerId,
  toggleShowMembers,
  showMembers,
  setShowMembers,
  membersMode,
  setMembersMode,
  getListLog,
  listId,
  userId,
  leaveList,
}) => {
  const [ownerNickname, setOwnerNickname] = useState("");
  const [sortedMembers, setSortedMembers] = useState([]);
  const [listLog, setListLog] = useState([]);

  const location = useLocation();

  const style = {
    link: `text-pink font-bold`,
    button: `bg-pink sticky bottom-0 mt-6 w-full text-white font-bold py-2 px-4 rounded-md`,
    closeButton: `absolute top-2 right-4 text-2xl text-pink font-bold`,
  };

  const getOwnerNickname = async () => {
    try {
      if (!ownerId) {
        // ownerId is undefined, handle it accordingly
        return;
      }
      const userDocRef = doc(db, "users", ownerId);
      const userDocSnapshot = await getDoc(userDocRef);

      if (userDocSnapshot.exists()) {
        const ownerData = userDocSnapshot.data();
        setOwnerNickname(ownerData.nickname);
      }
    } catch (error) {
      console.log("Error: ", error);
    }
  };

  const sortMembers = () => {
    const sorted = members.slice().sort((a, b) => {
      if (a.nickname === ownerNickname) return -1;
      if (b.nickname === ownerNickname) return 1;
      return 0;
    });
    setSortedMembers(sorted);
  };

  const toggleMembersMode = () => {
    setMembersMode(!membersMode);
  };

  useEffect(() => {
    getOwnerNickname();
  }, [ownerId]);

  useEffect(() => {
    sortMembers();
  }, [members, ownerNickname]);

  useEffect(() => {
    async function fetchData() {
      // You can await here
      const log = await getListLog();
      setListLog(log);
      // ...
    }

    // jos ei olla etusivulla, ei haeta listalogia
    if (location.pathname !== "/") {
      console.log(window.location.pathname);
      fetchData();
    }
  }, []);

  return (
    <div className="fixed top-1/3 left-1/2 w-3/4 md:w-96 max-h-80 transform -translate-x-1/2 -translate-y-1/2 z-50 overflow-auto bg-white p-8 rounded-md shadow-md">
      {location.pathname === "/" ? (
        // Content when on the root path
        <>
          <div className="flex justify-between items-baseline">
            <h2 className="text-2xl font-bold mb-4 overflow-auto">Jäsenet</h2>
          </div>

          <ul className="text-lg">
            {sortedMembers.map((member, index) => (
              <li
                className={`w-fit my-4 bg-dogwood rounded-md p-2 overflow-auto`}
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
      ) : (
        // Content when not on the root path
        <>
          {membersMode ? (
            <>
              <div className="flex justify-between items-baseline">
                <div className="flex gap-4 items-baseline">
                  <h2 className="text-2xl font-bold mb-4 overflow-auto">
                    Jäsenet
                  </h2>
                  <button onClick={toggleMembersMode} className={style.link}>
                    Historia
                  </button>
                </div>
                <button
                  onClick={toggleShowMembers}
                  className={style.closeButton}
                >
                  X
                </button>
              </div>
              <div>
                <ul className="text-lg">
                  {sortedMembers.map((member, index) => (
                    <li
                      className={`w-fit my-4 bg-dogwood rounded-md p-2 overflow-auto `}
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
                {ownerId !== auth.currentUser.uid && (
                  <button
                    onClick={() => leaveList(listId, userId)}
                    className={style.button}
                  >
                    poistu listalta
                  </button>
                )}
              </div>
            </>
          ) : (
            <>
              <div className="flex justify-between items-baseline">
                <div className="flex gap-4 items-baseline">
                  <h2 className="text-2xl font-bold mb-4 overflow-auto">
                    Historia
                  </h2>
                  <button
                    onClick={() => {
                      toggleMembersMode();
                    }}
                    className={style.link}
                  >
                    Jäsenet
                  </button>
                </div>
                <button
                  onClick={toggleShowMembers}
                  className={style.closeButton}
                >
                  X
                </button>
              </div>
              {!listLog ? (
                <p>Ei muokkaushistoriaa</p>
              ) : (
                <ul className="text-lg">
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
          )}
        </>
      )}
    </div>
  );
};
