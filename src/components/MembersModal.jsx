import { collection, doc, getDoc, getDocs, query } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { db } from "../firebase";

export const MembersModal = ({
  members,
  ownerId,
  membersMode,
  setMembersMode,
  getListLog,
}) => {
  const [ownerNickname, setOwnerNickname] = useState("");
  const [sortedMembers, setSortedMembers] = useState([]);
  const [listLog, setListLog] = useState([]);

  const style = {
    link: `text-pink font-bold`,
  };

  const getOwnerNickname = async () => {
    try {
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
    fetchData();
  }, []);

  return (
    <div className="fixed top-1/3 left-1/2 w-3/4 md:w-96 max-h-80 transform -translate-x-1/2 -translate-y-1/2 z-50 overflow-auto bg-white p-8 rounded-md shadow-md">
      <>
        {membersMode ? (
          <>
            <div className="flex justify-between items-baseline">
              <h2 className="text-2xl font-bold mb-4 overflow-auto">Jäsenet</h2>
              <button onClick={toggleMembersMode} className={style.link}>
                Historia
              </button>
            </div>
            <ul>
              {sortedMembers.map((member, index) => (
                <li
                  className={`w-fit ${
                    index % 2 === 0 ? "transparent" : "bg-gray-300"
                  }`}
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
          <>
            <div className="flex justify-between items-baseline">
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
            {!listLog ? (
              <p>Ei muokkaushistoriaa</p>
            ) : (
              <ul className="">
                {listLog.map((log, index) => (
                  <li
                    className={
                      "w-fit p-1 " +
                      (index % 2 === 0 ? "transparent" : "bg-gray-300")
                    }
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
    </div>
  );
};
