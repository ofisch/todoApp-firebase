import React, { useState } from "react";
import { homeStyle } from "../styles/homeStyle";
import { logout } from "../utils/utils";
import { useNavigate } from "react-router-dom";
import { InvitesModal } from "./InvitesModal";

export const HomeHeader = (props) => {
  const { toggleNewListMenu, userId } = props;

  const navigate = useNavigate();

  const [showInvitesModal, setShowInvitesModal] = useState(false);

  const toggleInvitesModal = () => {
    setShowInvitesModal(!showInvitesModal);
  };

  return (
    <header className={homeStyle.header}>
      <h1 className={homeStyle.heading}>listat</h1>
      <div className={homeStyle.headerButtons}>
        <button className="scale-125">
          <p
            className={homeStyle.icon}
            onClick={() => {
              logout();
              navigate("/");
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
        {showInvitesModal && <InvitesModal userId={userId} />}
        <button className={homeStyle.plusButton} onClick={toggleNewListMenu}>
          <p className={homeStyle.icon}>➕</p>
        </button>
      </div>
    </header>
  );
};
