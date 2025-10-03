import React, { useState } from "react";
import { supabase } from "../lib/supabaseClient";
import "./AddWordForm.css";

const AddWordForm = () => {
  const [word, setWord] = useState("");
  const [translation, setTranslation] = useState("");
  const [level, setLevel] = useState("bad");

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Envoi des données à Supabase
    const { data, error } = await supabase
      .from("vocabulary")
      .insert([
        {
          english: word,
          french: translation,
          understanding: level,
        },
      ]);

    if (error) {
      console.error("Erreur lors de l'ajout du mot :", error);
    } else {
      console.log("Mot ajouté avec succès :", data);
      // Réinitialiser le formulaire après l'ajout
      setWord("");
      setTranslation("");
      setLevel("bad");
    }
  };

  return (
    <div className="form-container">
      <h1>Ajouter un mot</h1>
      <form className="form" onSubmit={handleSubmit}>
        <input
          type="text"
          className="input"
          placeholder="Mot en anglais"
          value={word}
          onChange={(e) => setWord(e.target.value)}
          required
        />
        <input
          type="text"
          className="input"
          placeholder="Traduction française"
          value={translation}
          onChange={(e) => setTranslation(e.target.value)}
          required
        />
        <select
          className="select"
          value={level}
          onChange={(e) => setLevel(e.target.value)}
        >
          <option value="bad">Mauvais</option>
          <option value="medium">Moyen</option>
          <option value="good">Bien</option>
          <option value="perfect">Parfait</option>
        </select>
        <button type="submit" className="button">Ajouter</button>
      </form>
    </div>
  );
};

export default AddWordForm;
