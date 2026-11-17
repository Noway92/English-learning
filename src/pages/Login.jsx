import React, { useState } from "react";
import { supabase } from "../lib/supabaseClient";
import "./Login.css";

const Login = ({ refus }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleGoogle = async () => {
    setLoading(true);
    setError("");

    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: window.location.origin },
    });

    if (error) {
      setError(error.message);
      setLoading(false);
    }
  };

  return (
    <div className="form-container">
      <h1>Connexion</h1>
      <div className="form">
        {(error || refus) && <div className="error-message">{error || refus}</div>}
        <button
          type="button"
          className="button"
          onClick={handleGoogle}
          disabled={loading}
        >
          {loading ? "Redirection..." : "Se connecter avec Google"}
        </button>
      </div>
    </div>
  );
};

export default Login;
