import React, { useState } from "react";
import { supabase } from "../lib/supabaseClient";
import "./Login.css";

const Login = ({ onLogin }) => {
  const [identifiant, setIdentifiant] = useState("");
  const [mdp, setMdp] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      // Vérifier les identifiants dans la table TableUser
      const { data, error } = await supabase
        .from("tableuser")
        .select("*")
        .eq("identifiant", identifiant)
        .eq("mdp", mdp)
        .single();

     
        if (error) {
            throw new Error("Identifiant ou mot de passe incorrect");
        }

        if (data) {
            // Connexion réussie
            onLogin({
            id: data.id,
            identifiant: data.identifiant
            });
        } else {
            setError("Identifiant ou mot de passe incorrect");
        }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="form-container">
      <h1>Connexion</h1>
      <form className="form" onSubmit={handleSubmit}>
        <input
          type="text"
          className="input"
          placeholder="Identifiant"
          value={identifiant}
          onChange={(e) => setIdentifiant(e.target.value)}
          required
          disabled={loading}
        />
        <input
          type="password"
          className="input"
          placeholder="Mot de passe"
          value={mdp}
          onChange={(e) => setMdp(e.target.value)}
          required
          disabled={loading}
        />

        {error && <div className="error-message">{error}</div>}

        <button 
          type="submit" 
          className="button"
          disabled={loading}
        >
          {loading ? "Connexion..." : "Se connecter"}
        </button>
      </form>
    </div>
  );
};

export default Login;