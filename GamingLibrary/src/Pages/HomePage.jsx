// src/Pages/HomePage.jsx
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Hero from "../components/Hero";
import GameGrid from "../components/GameGrid";
import LoadingSpinner from "../components/LoadingSpinner";
import { getSteamGames } from "../services/Steam";
import { searchBoardGames } from "../services/BoardGame";

function HomePage() {
  const [videoGames, setVideoGames] = useState([]);
  const [boardGames, setBoardGames] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchTopGames() {
      try {
        setLoading(true);
        // Fetch Steam video games
        const steamData = await getSteamGames();
        setVideoGames(steamData.slice(0, 6)); // Top 6 video games

        // Fetch board games (using a popular query like 'catan' or general search)
        const bggData = await searchBoardGames("catan");
        // Simple mock transformation for Board Game items display
        setBoardGames([
          { id: "13", name: "Catan", type: "Board Game", rating: "7.1" },
          { id: "30549", name: "Pandemic", type: "Board Game", rating: "7.5" },
          { id: "170416", name: "Scythe", type: "Board Game", rating: "8.2" },
          { id: "167791", name: "Terraforming Mars", type: "Board Game", rating: "8.4" },
          { id: "224517", name: "Brass: Birmingham", type: "Board Game", rating: "8.6" },
          { id: "233090", name: "Gloomhaven", type: "Board Game", rating: "8.7" }
        ]);
      } catch (err) {
        console.error("Error fetching homepage games:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchTopGames();
  }, []);

  return (
    <div className="home-page">
      <Hero 
        title="Welcome to Gaming Library" 
        subtitle="Discover and explore your favorite games!" 
      />

      {/* Navigation Buttons to Jump to Specific Categories */}
      <div className="category-nav-buttons" style={{ display: "flex", justifyContent: "center", gap: "1rem", margin: "1.5rem 0" }}>
        <Link to="/video-games" className="btn btn-primary" style={{ padding: "0.75rem 1.5rem", borderRadius: "6px", textDecoration: "none", background: "#007bff", color: "#fff" }}>
          Video Games
        </Link>
        <Link to="/board-games" className="btn btn-secondary" style={{ padding: "0.75rem 1.5rem", borderRadius: "6px", textDecoration: "none", background: "#6c757d", color: "#fff" }}>
          Board Games
        </Link>
      </div>

      {loading ? (
        <LoadingSpinner />
      ) : (
        <div className="homepage-sections" style={{ padding: "0 1rem" }}>
          <section className="top-video-games" style={{ marginBottom: "2.5rem" }}>
            <h2>Top Video Games</h2>
            <GameGrid games={videoGames} />
          </section>

          <section className="top-board-games">
            <h2>Top Board Games</h2>
            <GameGrid games={boardGames} />
          </section>
        </div>
      )}
    </div>
  );
}

export default HomePage;