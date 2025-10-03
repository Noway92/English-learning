import { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";
import "./Vocabulary.css";

export default function Vocabulary() {
  const [words, setWords] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchWords = async () => {
      const { data, error } = await supabase
        .from("vocabulary")
        .select("*")
        .order("created_at", { ascending: false });

      if (!error) setWords(data);
    };
    fetchWords();
  }, []);

  const filteredWords = words.filter(
    (w) =>
      w.english.toLowerCase().includes(searchTerm.toLowerCase()) ||
      w.french.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getUnderstandingClass = (understanding) => {
    if (understanding === "perfect") {
      return "understanding-perfect";
    } else if (understanding === "medium") {
      return "understanding-medium";
    } else if (understanding == "good"){
      return "understanding-good";
    }else {
      return "understanding-low";
    }
  };

  return (
    <div className="vocabulary-container">
      <h1 className="vocabulary-title">Mon vocabulaire</h1>

      <div className="search-container">
        <input
          type="text"
          placeholder="Rechercher un mot..."
          className="search-input"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="table-container">
        <table className="vocabulary-table">
          <thead>
            <tr>
              <th>Anglais</th>
              <th>Français</th>
              <th>Compréhension</th>
            </tr>
          </thead>
          <tbody>
            {filteredWords.map((w) => (
              <tr key={w.id}>
                <td>{w.english}</td>
                <td>{w.french}</td>
                <td>
                  <span className={getUnderstandingClass(w.understanding)}>
                    {w.understanding}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
