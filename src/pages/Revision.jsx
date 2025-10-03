import { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";
import "./Revision.css";

export default function Revision() {
  const [words, setWords] = useState([]);
  const [currentWord, setCurrentWord] = useState(null);
  const [userAnswer, setUserAnswer] = useState("");
  const [showAnswer, setShowAnswer] = useState(false);
  const [isCorrect, setIsCorrect] = useState(null);
  const [understandingLevel, setUnderstandingLevel] = useState("medium");
  const [isEnglish, setIsEnglish] = useState(true);

  useEffect(() => {
    const fetchWords = async () => {
      const { data, error } = await supabase
        .from("vocabulary")
        .select("*");
      if (!error) {
        setWords(data);
      }
    };
    fetchWords();
  }, []);

  const selectWordToReview = () => {
    if (words.length === 0) return;

    // Filtrer les mots en fonction de leur niveau de compréhension
    const filteredWords = words.filter((word) => {
      return true; // On sélectionne tous les mots pour l'instant
    });

    if (filteredWords.length > 0) {
      const randomIndex = Math.floor(Math.random() * filteredWords.length);
      const selectedWord = filteredWords[randomIndex];
      setIsEnglish(Math.random() < 0.5); // Alterner entre anglais et français
      setCurrentWord(selectedWord);
    } else {
      setCurrentWord(null);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setShowAnswer(true);

    const correctAnswer = isEnglish ? currentWord.french : currentWord.english;
    setIsCorrect(userAnswer.toLowerCase() === correctAnswer.toLowerCase());
  };

  const handleNextWord = async () => {
    if (!currentWord) return;

    // Mettre à jour le niveau de compréhension
    const { error } = await supabase
      .from("vocabulary")
      .update({
        understanding: understandingLevel,
      })
      .eq("id", currentWord.id);

    if (!error) {
      setShowAnswer(false);
      setUserAnswer("");
      setIsCorrect(null);
      selectWordToReview();
    }
  };

  useEffect(() => {
    selectWordToReview();
  }, [words]);

  if (!currentWord) {
    return <div className="revision-container">Aucun mot à réviser pour le moment.</div>;
  }

  return (
    <div className="revision-container">
      <h1 className="revision-title">Réviser un mot</h1>

      <div className="word-display">
        <p className="word-text">{isEnglish ? currentWord.english : currentWord.french}</p>
      </div>

      <form className="answer-form" onSubmit={handleSubmit}>
        <input
          type="text"
          className="answer-input"
          placeholder="Votre réponse..."
          value={userAnswer}
          onChange={(e) => setUserAnswer(e.target.value)}
        />
        <button type="submit" className="submit-button">Vérifier</button>
      </form>

      {showAnswer && (
        <div className="answer-feedback">
          <p className={isCorrect ? "correct-answer" : "incorrect-answer"}>
            {isCorrect ? "Correct !" : `La bonne réponse est : ${isEnglish ? currentWord.french : currentWord.english}`}
          </p>

          <div className="understanding-selector">
            <label>Niveau de compréhension :</label>
            <select
              className="understanding-dropdown"
              value={understandingLevel}
              onChange={(e) => setUnderstandingLevel(e.target.value)}
            >
              <option value="bad">Mauvais</option>
              <option value="medium">Moyen</option>
              <option value="good">Bien</option>
              <option value="perfect">Parfait</option>
            </select>
          </div>

          <button className="next-button" onClick={handleNextWord}>Mot suivant</button>
        </div>
      )}
    </div>
  );
}
