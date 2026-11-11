// src/Pages/BoardGamesPage.jsx
import React, { useEffect, useState } from "react";
import GameGrid from "../components/GameGrid";
import LoadingSpinner from "../components/LoadingSpinner";
import { searchBoardGames, getFallbackBoardGames } from "../services/BoardGame";

function BoardGamesPage() {
  const [boardGames, setBoardGames] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchBoardGames() {
      try {
        setLoading(true);
        await searchBoardGames("strategy");
        // Load all fallback board games with their images
        setBoardGames(getFallbackBoardGames());
      } catch (err) {
        console.error("Error fetching board games:", err);
        setError("Failed to load board games.");
      } finally {
        setLoading(false);
      }
    }

    fetchBoardGames();
  }, []);

  return (
    <div className="board-games-page" style={{ padding: "1rem" }}>
      <h1>Board Games</h1>
      {loading && <LoadingSpinner />}
      {error && <p style={{ color: "red" }}>{error}</p>}
      {!loading && !error && <GameGrid games={boardGames} />}
    </div>
  );
}

export default BoardGamesPage;