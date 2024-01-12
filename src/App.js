import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import { Login } from "./views/Login";
import { List } from "./views/List";
import { Home } from "./views/Home";
import { AuthProvider } from "./context/AuthContext";
import { ListView } from "./views/ListView";
import { Profile } from "./views/Profile";

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/list" element={<List />} />
          <Route path="/listView/:id" element={<ListView />} />
          <Route path="profile/:id" element={<Profile />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
