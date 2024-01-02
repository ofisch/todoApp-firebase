import React, { useContext } from "react";
import { useAuth } from "../context/AuthContext";

export const Home = () => {
  const user = useAuth();

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
