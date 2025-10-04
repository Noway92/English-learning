import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./components/Navbar.jsx";
import AddWordForm from "./components/AddWordForm.jsx";
import Vocabulary from "./pages/Vocabulary";
import Revision from "./pages/Revision.jsx";
import Login from "./pages/Login.jsx";
import "./App.css"

const App = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Vérifier si l'utilisateur est déjà connecté au chargement
  useEffect(() => {
    const checkAuth = () => {
      const savedUser = sessionStorage.getItem('user');
      if (savedUser) {
        setUser(JSON.parse(savedUser));
      }
      setLoading(false);
    };

    checkAuth();
  }, []);

  const login = (userData) => {
    setUser(userData);
    sessionStorage.setItem('user', JSON.stringify(userData));
  };

  if (loading) {
    return <div className="loading">Chargement...</div>;
  }

  return (
    <Router>
      {user && <Navbar/>}
      <Routes>
        <Route 
          path="/login" 
          element={!user ? <Login onLogin={login} /> : <Navigate to="/" />} 
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
      </Routes>
    </Router>
  );
};

export default App;