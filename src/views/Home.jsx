import React, { useContext } from "react";
import { useAuth } from "../context/AuthContext";

export const Home = () => {
  const user = useAuth();

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
    </div>
  );
};
