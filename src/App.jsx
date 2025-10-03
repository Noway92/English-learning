import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import AddWord from "./pages/AddWord";
import Vocabulary from "./pages/Vocabulary";

export default function App() {
  return (
    <BrowserRouter>
      <nav className="flex gap-4 p-4 bg-gray-100">
        <Link to="/">Ajouter</Link>
        <Link to="/vocabulaire">Vocabulaire</Link>
      </nav>
      <Routes>
        <Route path="/" element={<AddWord />} />
        <Route path="/vocabulaire" element={<Vocabulary />} />
      </Routes>
    </BrowserRouter>
  );
}
