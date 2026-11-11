// src/Pages/HomePage.jsx
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Hero from "../components/Hero";
import GameGrid from "../components/GameGrid";
import LoadingSpinner from "../components/LoadingSpinner";
import { getSteamGames } from "../services/Steam";
import { searchBoardGames, getFallbackBoardGames } from "../services/BoardGame";

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

        // Fetch board games or use the rich fallback dataset with images
        await searchBoardGames("catan");
        setBoardGames(getFallbackBoardGames().slice(0, 6));
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

      {/* Navigation Buttons */}
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