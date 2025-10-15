import { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";
import "./Vocabulary.css";

export default function Vocabulary() {
  const [words, setWords] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [categories, setCategories] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [editFormData, setEditFormData] = useState({
    english: "",
    french: "",
    category: "",
    understanding: "",
  });

  useEffect(() => {
    const fetchWords = async () => {
      const { data, error } = await supabase
        .from("vocabulary")
        .select("*")
        .order("created_at", { ascending: false });

      if (!error && data) {
        setWords(data);
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

  const handleEditClick = (word) => {
    setEditingId(word.id);
    setEditFormData({
      english: word.english,
      french: word.french,
      category: word.category,
      understanding: word.understanding,
    });
  };

  const handleEditFormChange = (e) => {
    const { name, value } = e.target;
    setEditFormData({
      ...editFormData,
      [name]: value,
    });
  };

  const handleSaveClick = async () => {
    const { error } = await supabase
      .from("vocabulary")
      .update(editFormData)
      .eq("id", editingId);

    if (!error) {
      const updatedWords = words.map((word) =>
        word.id === editingId ? { ...word, ...editFormData } : word
      );
      setWords(updatedWords);
      setEditingId(null);
    }
  };

  const handleCancelClick = () => {
    setEditingId(null);
  };

  return (
    <div className="vocabulary-container">
      <h1 className="vocabulary-title">Mon vocabulaire</h1>
      <div className="filters-container">
        <input
          type="text"
          placeholder="Rechercher un mot..."
          className="search-input"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
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
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredWords.map((w) => (
              <tr key={w.id}>
                {editingId === w.id ? (
                  <>
                    <td>
                      <input
                        type="text"
                        name="english"
                        value={editFormData.english}
                        onChange={handleEditFormChange}
                      />
                    </td>
                    <td>
                      <input
                        type="text"
                        name="french"
                        value={editFormData.french}
                        onChange={handleEditFormChange}
                      />
                    </td>
                    <td>
                      <select
                        name="category"
                        value={editFormData.category}
                        onChange={handleEditFormChange}
                      >
                        {categories.map((cat) => (
                          <option key={cat} value={cat}>
                            {cat}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td>
                      <select
                        name="understanding"
                        value={editFormData.understanding}
                        onChange={handleEditFormChange}
                      >
                        <option value="perfect">Parfait</option>
                        <option value="medium">Moyen</option>
                        <option value="good">Bon</option>
                        <option value="bad">Faible</option>
                      </select>
                    </td>
                    <td>
                      <button
                        className="audio-btn"
                        onClick={() => AudioAnglaisVoc(w.english)}
                      >
                        🔊
                      </button>
                    </td>
                    <td>
                      <button className="save-btn" onClick={handleSaveClick}>Sauvegarder</button>
                      <button className="cancel-btn" onClick={handleCancelClick}>Annuler</button>
                    </td>
                  </>
                ) : (
                  <>
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
                    <td>
                      <button className="edit-btn" onClick={() => handleEditClick(w)}>
                        Modifier
                      </button>
                    </td>
                  </>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
