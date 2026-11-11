// src/components/GameGrid.jsx
import React from "react";
import GameCard from "./GameCard";

function GameGrid({ games = [] }) {
  if (!games || games.length === 0) {
    return <p className="no-games">No games found.</p>;
  }

  return (
    <div className="game-grid" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: "1.5rem" }}>
      {games.map((game, index) => {
        const key = game.id || game.appid || index;
        return <GameCard key={key} game={game} />;
      })}
    </div>
  );
}

export default GameGrid;