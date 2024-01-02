import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import { Login } from "./views/Login";
import { List } from "./views/List";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/list" element={<List />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
