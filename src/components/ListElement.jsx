import React, { useState, useEffect, useRef } from "react";
import {
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  query,
} from "firebase/firestore";
import { auth, db } from "../firebase";
import { MembersModal } from "./MembersModal";
import { useNavigate } from "react-router-dom";

const style = {
  li: `flex justify-between border bg-dogwood p-4 my-2`,
  liComplete: `flex justify-between border bg-blue p-4 my-2`,
  row: `flex`,
  text: `cursor-pointer`,
  textComplete: `ml-2 cursor-pointer line-through`,
  button: `cursor-pointer flex items-center`,
  members: `transition ease-in-out delay-70 hover:scale-130 duration-70`,
};

export const ListElement = ({ icon, name, id, fetchUserLists, userId }) => {
  const [showMembers, setShowMembers] = useState(false);
  const [members, setMembers] = useState([]);
  const [ownerId, setOwnerId] = useState("");

  const navigate = useNavigate();

  const getListOwnerNickname = async () => {
    try {
      const listDocRef = doc(db, "lists", id);
      const listDocSnapshot = await getDoc(listDocRef);

      if (listDocSnapshot.exists()) {
        const listData = listDocSnapshot.data();
        setOwnerId(listData.owner);
      }
    } catch (error) {
      console.error("Error getting list owner:", error);
    }
  };

  const deleteList = async () => {
    try {
      if (
        window.confirm(
          "❗ Poistettua listaa ei voi palauttaa, poistetaanko lista?"
        )
      ) {
        const listDocRef = doc(db, "lists", id);
        await deleteDoc(listDocRef);
        fetchUserLists();
      }
    } catch (error) {
      console.error("Error deleting list:", error);
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

  const handleClickList = () => {
    navigate(`/listView/${id}`);
  };

  const listElementRef = useRef(null);

  useEffect(() => {
    const handleClickOutsideModal = (event) => {
      if (
        listElementRef.current &&
        !listElementRef.current.contains(event.target)
      ) {
        // Click outside the modal, close it
        setShowMembers(false);
      }
    };

    // Add global click event listener
    document.addEventListener("mousedown", handleClickOutsideModal);

    return () => {
      // Cleanup the event listener when the component unmounts
      document.removeEventListener("mousedown", handleClickOutsideModal);
    };
  }, []);

  return (
    <li className={style.li} ref={listElementRef}>
      <div onClick={handleClickList} className={style.row}>
        <p className={style.text}>{icon + name}</p>
      </div>
      <div>
        <button onClick={toggleShowMembers}>
          <p className={style.members}>👥</p>
        </button>
      </div>
      {showMembers && <MembersModal members={members} ownerId={ownerId} />}
    </li>
  );
};
