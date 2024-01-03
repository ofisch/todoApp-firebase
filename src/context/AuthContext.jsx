import { createContext, useContext, useEffect, useState } from "react";
import { auth } from "../firebase";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    auth.onAuthStateChanged((currentUser) => {
      setUser(currentUser);

      // Reauthenticate the user on each page load
      if (currentUser) {
        currentUser.getIdToken().then((token) => {
          // Use the token as needed (e.g., send it to the server for authentication)
        });
      }
    });
  }, []);

  return <AuthContext.Provider value={user}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  return useContext(AuthContext);
};
