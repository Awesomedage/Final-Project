// src/Pages/BoardGamesPage.jsx
import React, { useEffect, useState } from "react";
import GameGrid from "../components/GameGrid";
import LoadingSpinner from "../components/LoadingSpinner";
import { searchBoardGames } from "../services/BoardGame";

function BoardGamesPage() {
  const [boardGames, setBoardGames] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchBoardGames() {
      try {
        setLoading(true);
        // Default search query to populate board games on initial render
        await searchBoardGames("strategy");
        
        setBoardGames([
          { id: "13", name: "Catan", type: "Board Game", rating: "7.1" },
          { id: "30549", name: "Pandemic", type: "Board Game", rating: "7.5" },
          { id: "170416", name: "Scythe", type: "Board Game", rating: "8.2" },
          { id: "167791", name: "Terraforming Mars", type: "Board Game", rating: "8.4" },
          { id: "224517", name: "Brass: Birmingham", type: "Board Game", rating: "8.6" },
          { id: "233090", name: "Gloomhaven", type: "Board Game", rating: "8.7" },
          { id: "12333", name: "Twilight Imperium", type: "Board Game", rating: "8.7" },
          { id: "287235", name: "Dune: Imperium", type: "Board Game", rating: "8.3" }
        ]);
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