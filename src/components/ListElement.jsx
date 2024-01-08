import React, { useState, useEffect } from "react";
import { collection, doc, getDoc, getDocs, query } from "firebase/firestore";
import { db } from "../firebase";
import { MembersModal } from "./MembersModal";

const style = {
  li: `flex justify-between border bg-dogwood p-4 my-2`,
  liComplete: `flex justify-between border bg-blue p-4 my-2`,
  row: `flex`,
  text: `ml-2 cursor-pointer`,
  textComplete: `ml-2 cursor-pointer line-through`,
  button: `cursor-pointer flex items-center`,
  members: `transition ease-in-out delay-70 hover:scale-130 duration-70`,
};

export const ListElement = ({ name, id }) => {
  const [showMembers, setShowMembers] = useState(false);
  const [members, setMembers] = useState([]);
  const [ownerId, setOwnerId] = useState("");

  const getListOwnerNickname = async () => {
    try {
      const listDocRef = doc(db, "lists", id);
      const listDocSnapshot = await getDoc(listDocRef);

      if (listDocSnapshot.exists()) {
        const listData = listDocSnapshot.data();
        console.log("listData", listData);
        setOwnerId(listData.owner);
      }
    } catch (error) {
      console.error("Error getting list owner:", error);
    }
  };

  useEffect(() => {
    const fetchMembers = async () => {
      const membersArray = [];
      const membersSnapshot = await getDocs(
        query(collection(db, "lists", id, "members"))
      );
      membersSnapshot.forEach((member) => {
        membersArray.push(member.data());
      });
      setMembers(membersArray);
    };

    if (showMembers) {
      fetchMembers();
      getListOwnerNickname();
    }
  }, [showMembers, id]);

  const toggleShowMembers = () => {
    setShowMembers(!showMembers);
  };

  return (
    <li className={style.li}>
      <div className={style.row}>
        <p className={style.text}>{name}</p>
      </div>
      <button onClick={toggleShowMembers}>
        <p className={style.members}>👤</p>
      </button>
      {showMembers && <MembersModal members={members} ownerId={ownerId} />}
    </li>
  );
};
