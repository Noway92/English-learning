import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar.jsx";
import AddWordForm from "./components/AddWordForm.jsx";
import Vocabulary from "./pages/Vocabulary";
import Revision from "./pages/Revision.jsx"
import "./App.css"

const App = () => {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<AddWordForm />} />
        <Route path="/vocabulary" element={<Vocabulary />} />
        <Route path="/revision" element={<Revision/>} />
      </Routes>
    </Router>
  );
};

export default App;
