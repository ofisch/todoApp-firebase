import React, { useState } from "react";
import { homeStyle } from "../styles/homeStyle";
import { logout } from "../utils/utils";
import { useNavigate } from "react-router-dom";

export const HomeHeader = (props) => {
  const { toggleNewListMenu } = props;

  const navigate = useNavigate();

  return (
    <header className={homeStyle.header}>
      <h1 className={homeStyle.heading}>listat</h1>
      <div className={homeStyle.headerButtons}>
        <button>
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
        <button className={homeStyle.plusButton} onClick={toggleNewListMenu}>
          <p className={homeStyle.icon}>➕</p>
        </button>
      </div>
    </header>
  );
};
