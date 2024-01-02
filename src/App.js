import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import { Login } from "./views/Login";
import { List } from "./views/List";
import { Home } from "./views/Home";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/list" element={<List />} />
        <Route path="/home" element={<Home />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
