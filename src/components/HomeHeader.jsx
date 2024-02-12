import React, { useEffect, useRef, useState } from "react";
import { homeStyle } from "../styles/homeStyle";
import { logout } from "../utils/utils";
import { useNavigate } from "react-router-dom";
import { InvitesModal } from "./InvitesModal";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  onSnapshot,
  query,
  subcollection,
} from "firebase/firestore";
import { auth, db } from "../firebase";

export const HomeHeader = (props) => {
  const { toggleNewListMenu, userId, fetchUserLists } = props;

  const navigate = useNavigate();

  const [showInvitesModal, setShowInvitesModal] = useState(false);
  const [invites, setInvites] = useState([]); // [{id: "inviteId", listId: "listId"}

  const [invitesLength, setInvitesLength] = useState(0);

  const toggleInvitesModal = () => {
    setShowInvitesModal(!showInvitesModal);
  };

  const getInvitesLength = async (userId) => {
    try {
      console.log("uid: ", userId);
      const userDocRef = doc(db, "users", userId);

      const receivedInvitesCollectionRef = collection(
        userDocRef,
        "receivedInvites"
      );

      const querySnapshot = await getDocs(receivedInvitesCollectionRef);

      return querySnapshot.size;
    } catch (error) {
      console.error("Error: fetching invites: ", error);
      return 0;
    }
  };

  const ref = useRef(null);

  useEffect(() => {
    const handleClickOutsideMenu = (event) => {
      if (ref.current && !ref.current.contains(event.target)) {
        // Click outside the menu, close it
        setShowInvitesModal(false);
      }
    };

    // Add global click event listener
    document.addEventListener("mousedown", handleClickOutsideMenu);

    return () => {
      // Cleanup the event listener when the component unmounts
      document.removeEventListener("mousedown", handleClickOutsideMenu);
    };
  }, [showInvitesModal]);

  const goTo = (path) => {
    navigate(path);
  };

  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrolled = window.scrollY > 0;
      setIsScrolled(scrolled);
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  useEffect(() => {
    if (userId) {
      const userDocRef = doc(db, "users", userId);
      const receivedInvitesCollectionRef = collection(
        userDocRef,
        "receivedInvites"
      );

      // Create a snapshot listener to listen for real-time updates
      const unsubscribe = onSnapshot(
        receivedInvitesCollectionRef,
        (snapshot) => {
          // Update the invitesLength state with the new size of the snapshot
          setInvitesLength(snapshot.size);
        }
      );

      // Clean up the listener when the component unmounts or userId changes
      return () => unsubscribe();
    }
  }, [userId]); // Add userId as a dependency

  return (
    <header
      className={`${homeStyle.header}`}
      style={{
        backgroundColor: isScrolled
          ? localStorage.getItem("color")
          : "transparent",
      }}
      ref={ref}
    >
      <h1 className={homeStyle.heading}>{`Listat - ${localStorage.getItem(
        "nickname"
      )}`}</h1>
      <div className={homeStyle.headerButtons}>
        <button className="scale-125">
          <p
            className={homeStyle.icon}
            onClick={() => {
              goTo(`/profile/${userId}`);
            }}
          >
            👤
          </p>
        </button>
        <button onClick={toggleInvitesModal} className="scale-125">
          <div className="relative">
            <p className={homeStyle.icon}>🔔</p>
            {invitesLength > 0 ? (
              <span className="bg-pink text-white font-semibold text-sm w-[20px] h-[20px] rounded-full absolute top-3 right-2">
                {invitesLength}
              </span>
            ) : null}
          </div>
        </button>
        {showInvitesModal && (
          <InvitesModal
            userId={userId}
            toggleInvitesModal={toggleInvitesModal}
            fetchUserLists={fetchUserLists}
          />
        )}
        <button className={homeStyle.plusButton} onClick={toggleNewListMenu}>
          <p className={homeStyle.icon}>➕</p>
        </button>
      </div>
    </header>
  );
};
