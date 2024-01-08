import { collection, getDocs, query } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { db } from "../firebase";

export const MembersModal = ({ members, ownerId }) => {
  const [ownerNickname, setOwnerNickname] = useState("");
  const [sortedMembers, setSortedMembers] = useState([]);

  const getOwnerNickname = async () => {
    try {
      const q = query(collection(db, "users"), ownerId);
      const querySnapshot = await getDocs(q);

      const ownerData = querySnapshot.docs.map((doc) => doc.data());

      setOwnerNickname(ownerData[0].nickname);
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

  useEffect(() => {
    getOwnerNickname();
  }, [ownerNickname]);

  useEffect(() => {
    sortMembers();
  }, [members, ownerNickname]);

  return (
    <div className="fixed top-1/3 left-1/2 w-3/4 md:w-96 transform -translate-x-1/2 -translate-y-1/2 z-50 bg-white p-8 rounded-md shadow-md">
      <>
        <div className="flex justify-between items-baseline">
          <h2 className="text-2xl font-bold mb-4 overflow-auto">Jäsenet</h2>
        </div>
        <ul>
          {sortedMembers.map((member, index) => (
            <li
              className={index % 2 === 0 ? "bg-slate-300 w-fit" : "w-fit"}
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
    </div>
  );
};
