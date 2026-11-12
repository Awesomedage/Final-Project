// src/Pages/SavedPage.jsx
import React, { useState, useEffect } from "react";
import GameGrid from "../components/GameGrid";

function SavedPage() {
  const [savedGames, setSavedGames] = useState([]);

  useEffect(() => {
    // Load saved games from localStorage safely
    try {
      const saved = JSON.parse(localStorage.getItem("savedGames")) || [];
      setSavedGames(saved);
    } catch (err) {
      console.error("Error loading saved games from localStorage:", err);
      setSavedGames([]);
    }
  }, []);

  return (
    <div className="saved-page" style={{ padding: "1.5rem" }}>
      <h1>Your Saved Games</h1>
      {savedGames.length === 0 ? (
        <p>You haven't saved any games yet. Browse video games or board games to add some!</p>
      ) : (
        <GameGrid games={savedGames} />
      )}
    </div>
  );
}

export default SavedPage;