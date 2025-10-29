import { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";
import "./Revision.css";

export default function Perfect() {
  const [words, setWords] = useState([]);
  const [currentWord, setCurrentWord] = useState(null);
  const [userAnswer, setUserAnswer] = useState("");
  const [showAnswer, setShowAnswer] = useState(false);
  const [isCorrect, setIsCorrect] = useState(null);
  const [understandingLevel, setUnderstandingLevel] = useState("bad");
  const [isEnglish, setIsEnglish] = useState(true);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");

    useEffect(() => {
        const fetchWords = async () => {
            const today = new Date().toISOString(); 
            if (selectedCategory === "") {
                const { data, error } = await supabase
                    .from("vocabulary")
                    .select("*")
                    .eq("understanding", "perfect");

                if (error) {
                console.error("Erreur lors de la récupération des mots parfaits:", error);
                } else {
                    setWords(data);
                    const uniqueCategories = [...new Set(data.map((w) => w.category))];
                    setCategories(uniqueCategories);
                }
            } else {
                const { data, error } = await supabase
                    .from("vocabulary")
                    .select("*")
                    .eq("understanding", "perfect")
                    .eq("category", selectedCategory);

                if (error) {
                console.error("Erreur lors de la récupération des mots parfaits:", error);
                } else {
                    setWords(data);
                }
            };
        };
        fetchWords();
    }, [selectedCategory]);

    const selectWordToReview = () => {
        console.log(words);

        let selectedWord = null;

        const randomIndex = Math.floor(Math.random() * words.length);
        selectedWord = words[randomIndex];

    if (selectedWord) {
        setIsEnglish(Math.random() < 0.5); // Alterner entre anglais et français
        setCurrentWord(selectedWord);
        setUnderstandingLevel(selectedWord.understanding);
    } else {
        setCurrentWord(null); // Aucun mot à réviser
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

        // Vérifier si le niveau de compréhension a changé
        const shouldUpdateUnderstanding = understandingLevel !== currentWord.understanding || understandingLevel!=="bad";

        // Calculer la nouvelle date de révision en fonction du niveau de compréhension
        let nextReviewAt;
        const today = new Date();

        if (understandingLevel === "perfect") {
        // Ajouter 100 ans
        nextReviewAt = new Date(today);
        nextReviewAt.setFullYear(today.getFullYear() + 100);
        } else if (understandingLevel === "good") {
        // Ajouter 7 jours
        nextReviewAt = new Date(today);
        nextReviewAt.setDate(today.getDate() + 7);
        } else if (understandingLevel === "medium") {
        // Ajouter 2 jours
        nextReviewAt = new Date(today);
        nextReviewAt.setDate(today.getDate() + 3);
        } else if (understandingLevel === "bad") {
        // Laisser la date du jour
        nextReviewAt = today;
        }

        // Mettre à jour le niveau de compréhension uniquement si nécessaire
        if (shouldUpdateUnderstanding) {
        const { error } = await supabase
            .from("vocabulary")
            .update({
            understanding: understandingLevel,
            next_review_at: nextReviewAt.toISOString(), 
            })
            .eq("id", currentWord.id);

        if (error) {
            console.error("Erreur lors de la mise à jour du niveau de compréhension :", error);
            return; // Arrêter si une erreur survient
        }
        }

        // Réinitialiser, supprimer le mot actuel et passer au mot suivant

        setShowAnswer(false);
        setUserAnswer("");
        setIsCorrect(null);
        setWords((prevWords) => {
        const newWords = prevWords.filter((word) => word.id !== currentWord.id);
        return newWords;
        });

    };


    const AudioAnglais = ()=> {
        const utterance = new SpeechSynthesisUtterance(currentWord.english);
        utterance.lang = "en-US";
        speechSynthesis.speak(utterance);
    }

    useEffect(() => {
        selectWordToReview();
    }, [words]);
    
    if (!currentWord) {
        return (
            <div className="revision-container">
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
            <div className="revision-container">Pas de mot Parfait dans la liste.</div>
            </div>
        );
    }

  

    return (
        <div className="revision-container">
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
            <h1 className="revision-title">Réviser un mot Parfait ({words.length} {words.length === 1 ? 'mot' : 'mots'})</h1>

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
                <div className="button-class">
                    <button className="audio-btn" onClick={AudioAnglais}>🔊</button>

                    <button className="next-button" onClick={handleNextWord}>Mot suivant</button>
                </div>
                </div>
            )}
        </div>
    );
}
