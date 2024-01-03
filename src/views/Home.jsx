import React, { useContext } from "react";
import { useAuth } from "../context/AuthContext";
import { signOut } from "firebase/auth";
import { auth } from "../firebase";

import { logout } from "../utils/utils";
import { useNavigate } from "react-router-dom";

export const Home = () => {
  const user = useAuth();
  const navigate = useNavigate();
  // ylhäällä stickynä header, oikeella plussa jota painamalla voi luoda
  // tai liittyä uuteen listaan
  // headerissa kans logout ja vaik profiili-info (ehk nappi?)

  return (
    <div>
      {user ? (
        <p>Welcome, {user.email}!</p>
      ) : (
        <p>Please sign in to access the content.</p>
      )}
      <button onClick={(() => logout, () => navigate("/"))}>
        kirjaudu ulos
      </button>
    </div>
  );
};
