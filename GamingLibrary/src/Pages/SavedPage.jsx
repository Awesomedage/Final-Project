// src/Pages/SavedPage.jsx
import React from "react";
import GameGrid from "../components/GameGrid";

function SavedPage({ savedGames = [] }) {
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