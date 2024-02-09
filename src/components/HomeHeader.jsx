import React, { useEffect, useRef, useState } from "react";
import { homeStyle } from "../styles/homeStyle";
import { logout } from "../utils/utils";
import { useNavigate } from "react-router-dom";
import { InvitesModal } from "./InvitesModal";
import { collection, doc, getDoc, getDocs, query } from "firebase/firestore";
import { db } from "../firebase";

export const HomeHeader = (props) => {
  const { toggleNewListMenu, userId, fetchUserLists } = props;

  const navigate = useNavigate();

  const [showInvitesModal, setShowInvitesModal] = useState(false);
  const [invites, setInvites] = useState([]); // [{id: "inviteId", listId: "listId"}

  const toggleInvitesModal = () => {
    setShowInvitesModal(!showInvitesModal);
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
        <button className="scale-125">
          <p onClick={toggleInvitesModal} className={homeStyle.icon}>
            🔔
          </p>
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
