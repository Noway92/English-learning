import React, { useState } from "react";
import { supabase } from "../lib/supabaseClient";
import "./AddWordForm.css";

const AddWordForm = () => {
  const [word, setWord] = useState("");
  const [translation, setTranslation] = useState("");
  const [level, setLevel] = useState("bad");
  const [category, setCaterory] = useState("Other");

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
          category: category
        },
      ]);

    if (error) {
      console.error("Erreur lors de l'ajout du mot :", error);
    } else {
      console.log("Mot ajouté avec succès :");
      // Réinitialiser le formulaire après l'ajout
      setWord("");
      setTranslation("");
      setLevel("bad");
      setCaterory("Other")
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
          value={word.toLowerCase()}
          onChange={(e) => setWord(e.target.value)}
          required
        />
        <input
          type="text"
          className="input"
          placeholder="Traduction française"
          value={translation.toLowerCase()}
          onChange={(e) => setTranslation(e.target.value)}
          required
        />
        <select
          className="select-category"
          value={level}
          onChange={(e) => setCaterory(e.target.value)}
        >
          <option value="Other">Other</option>
          <option value="Human being and development">Human being and development</option>
          <option value="Mind, character and emotions">Mind, character and emotions</option>
          <option value="Human actions and habilities">Human actions and habilities</option>
          <option value="Food and daily needs">Food and daily needs</option>
          <option value="Home and practical life">Home and practical life</option>
          <option value="Free time, body and health">Free time, body and health</option>
          <option value="Society">Society</option>
          <option value="The world">The world</option>
          <option value="Geopolitics">Geopolitics</option>
          <option value="Economic activity">Economic activity</option>
          <option value="Science and technologie">Science and technologie</option>
          <option value="Art and culture">Art and culture</option>
          <option value="Time">Time</option>
          <option value="Notions">Notions</option>
        </select>
        <select
          className="select-level"
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
