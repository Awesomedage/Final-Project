// src/Pages/BoardGamesPage.jsx
import React, { useEffect, useState } from "react";
import GameGrid from "../components/GameGrid";
import LoadingSpinner from "../components/LoadingSpinner";
import { searchBoardGames, getFallbackBoardGames } from "../services/BoardGame";
import "./BoardGamesPage.css";

function BoardGamesPage() {
  const [boardGames, setBoardGames] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchBoardGames() {
      try {
        setLoading(true);
        // Hits BGG search endpoint first and falls back to getFallbackBoardGames() on queue/error
        const data = await searchBoardGames("");
        setBoardGames(data && data.length > 0 ? data : getFallbackBoardGames());
      } catch (err) {
        console.error("Error fetching board games:", err);
        setBoardGames(getFallbackBoardGames());
      } finally {
        setLoading(false);
      }
    }

    fetchBoardGames();
  }, []);

  return (
    <div className="board-games-page">
      <h1>Board Games Catalog</h1>
      <p className="board-games-subtitle">
        Explore top-rated tabletop games and strategy classics.
      </p>

      {loading ? (
        <LoadingSpinner />
      ) : (
        <GameGrid games={boardGames} />
      )}
    </div>
  );
}

export default BoardGamesPage;