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
import { MembersModalHome } from "./MemberSubModals/MembersModalHome";

import { modalStyle } from "../styles/modalStyle";
import { MembersModalList } from "./MemberSubModals/MembersModalList";
import { HistoryModalList } from "./MemberSubModals/HistoryModalList";

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
  removeUser,
}) => {
  const [ownerNickname, setOwnerNickname] = useState("");
  const [sortedMembers, setSortedMembers] = useState([]);
  const [listLog, setListLog] = useState([]);

  const location = useLocation();

  // haetaan omistajan käyttäjätunnus
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

  // järjestetään jäsenet niin, että omistaja on ensimmäisenä
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
    <div className="fixed top-1/2 left-1/2 w-3/4 md:top-1/3 md:w-96 max-h-80 transform -translate-x-1/2 -translate-y-1/2 z-50 overflow-auto bg-white rounded-md shadow-md">
      {location.pathname === "/" ? (
        // sisältö etusivulla
        <MembersModalHome
          toggleShowMembers={toggleShowMembers}
          sortedMembers={sortedMembers}
          ownerNickname={ownerNickname}
        ></MembersModalHome>
      ) : (
        // sisältö listanäkymässä
        <>
          {membersMode ? (
            <MembersModalList
              toggleMembersMode={toggleMembersMode}
              toggleShowMembers={toggleShowMembers}
              sortedMembers={sortedMembers}
              ownerNickname={ownerNickname}
              ownerId={ownerId}
              auth={auth}
              leaveList={leaveList}
              removeUser={removeUser}
              listId={listId}
              userId={userId}
            ></MembersModalList>
          ) : (
            <HistoryModalList
              toggleMembersMode={toggleMembersMode}
              toggleShowMembers={toggleShowMembers}
              listLog={listLog}
            ></HistoryModalList>
          )}
        </>
      )}
    </div>
  );
};
