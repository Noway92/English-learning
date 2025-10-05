import { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";
import "./Vocabulary.css";

export default function Vocabulary() {
  const [words, setWords] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState(""); 
  const [categories, setCategories] = useState([]); 

  useEffect(() => {
    const fetchWords = async () => {
      const { data, error } = await supabase
        .from("vocabulary")
        .select("*")
        .order("created_at", { ascending: false });

      if (!error && data) {
        setWords(data);

        // 🔹 Création de la liste unique des catégories
        const uniqueCategories = [...new Set(data.map((w) => w.category))];
        setCategories(uniqueCategories);
      }
    };
    fetchWords();
  }, []);

  const AudioAnglaisVoc = (word) => {
    const utterance = new SpeechSynthesisUtterance(word);
    utterance.lang = "en-US";
    speechSynthesis.speak(utterance);
  };

  // filtrage combiné texte + catégorie
  const filteredWords = words.filter((w) => {
    const matchesSearch =
      w.english.toLowerCase().includes(searchTerm.toLowerCase()) ||
      w.french.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCategory =
      selectedCategory === "" || w.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  const getUnderstandingClass = (understanding) => {
    if (understanding === "perfect") return "understanding-perfect";
    if (understanding === "medium") return "understanding-medium";
    if (understanding === "good") return "understanding-good";
    return "understanding-low";
  };

  return (
    <div className="vocabulary-container">
      <h1 className="vocabulary-title">Mon vocabulaire</h1>

      <div className="filters-container">
        {/* Recherche */}
        <input
          type="text"
          placeholder="Rechercher un mot..."
          className="search-input"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />

        {/* Sélecteur de catégorie */}
        <select
          className="category-select"
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
        >
          <option value="">Toutes les catégories</option>
          {categories.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>
      </div>

      <div className="table-container">
        <table className="vocabulary-table">
          <thead>
            <tr>
              <th>Anglais</th>
              <th>Français</th>
              <th>Catégorie</th>
              <th>Compréhension</th>
              <th>Audio</th>
            </tr>
          </thead>
          <tbody>
            {filteredWords.map((w) => (
              <tr key={w.id}>
                <td>{w.english}</td>
                <td>{w.french}</td>
                <td>{w.category}</td>
                <td>
                  <span className={getUnderstandingClass(w.understanding)}>
                    {w.understanding}
                  </span>
                </td>
                <td>
                  <button
                    className="audio-btn"
                    onClick={() => AudioAnglaisVoc(w.english)}
                  >
                    🔊
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
