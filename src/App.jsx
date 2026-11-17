import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./components/Navbar.jsx";
import AddWordForm from "./components/AddWordForm.jsx";
import Vocabulary from "./pages/Vocabulary";
import Revision from "./pages/Revision.jsx";
import Perfect from "./pages/Perfect.jsx";
import Login from "./pages/Login.jsx";
import { supabase } from "./lib/supabaseClient";
import "./App.css"

const EMAILS_AUTORISES = (import.meta.env.VITE_EMAILS_AUTORISES ?? "")
  .split(",")
  .map((e) => e.trim().toLowerCase())
  .filter(Boolean);

const App = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refus, setRefus] = useState("");

  useEffect(() => {
    const appliquer = (session) => {
      const u = session?.user ?? null;
      if (u && !EMAILS_AUTORISES.includes((u.email ?? "").toLowerCase())) {
        setRefus("Ce compte Google n'est pas autorisé.");
        setUser(null);
        supabase.auth.signOut();
        return;
      }
      setUser(u);
    };

    supabase.auth.getSession().then(({ data }) => {
      appliquer(data.session);
      setLoading(false);
    });

    const { data } = supabase.auth.onAuthStateChange((_event, session) => {
      appliquer(session);
    });

    return () => data.subscription.unsubscribe();
  }, []);

  if (loading) {
    return <div className="loading">Chargement...</div>;
  }

  return (
    <Router>
      {user && <Navbar/>}
      <Routes>
        <Route 
          path="/login" 
          element={!user ? <Login refus={refus} /> : <Navigate to="/" />} 
        />
        <Route 
          path="/" 
          element={user ? <AddWordForm /> : <Navigate to="/login" />} 
        />
        <Route 
          path="/vocabulary" 
          element={user ? <Vocabulary /> : <Navigate to="/login" />} 
        />
        <Route 
          path="/revision" 
          element={user ? <Revision /> : <Navigate to="/login" />} 
        />
        <Route 
          path="/perfect" 
          element={user ? <Perfect /> : <Navigate to="/login" />} 
        />
      </Routes>
    </Router>
  );
};

export default App;