// src/Pages/HomePage.jsx
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Hero from "../components/Hero";
import GameGrid from "../components/GameGrid";
import LoadingSpinner from "../components/LoadingSpinner";
import { getSteamGames } from "../services/Steam";
import { searchBoardGames, getFallbackBoardGames } from "../services/BoardGame";
import "./HomePage.css";

function HomePage({ searchResults }) {
  const [videoGames, setVideoGames] = useState([]);
  const [boardGames, setBoardGames] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchTopGames() {
      try {
        setLoading(true);
        // Fetch Steam video games
        const steamData = await getSteamGames();
        setVideoGames(steamData);

        // Fetch board games  
        const boardData = await searchBoardGames("");
        setBoardGames(boardData && boardData.length > 0 ? boardData : getFallbackBoardGames());
      } catch (err) {
        console.error("Error fetching homepage games:", err);
        setBoardGames(getFallbackBoardGames());
      } finally {
        setLoading(false);
      }
    }

    fetchTopGames();
  }, []);

  if (loading) {
    return (
      <main className="home-page home-page-loading">
        <LoadingSpinner />
      </main>
    );
  }

  return (
    <div className="home-page">
      <Hero 
        title="Welcome to Gaming Library" 
        subtitle="Discover and explore your favorite games!" 
      />

      <div className="category-nav-buttons">
        <Link to="/video-games" className="btn btn-primary category-btn">
          Video Games
        </Link>
        <Link to="/board-games" className="btn btn-secondary category-btn">
          Board Games
        </Link>
      </div>

      <div className="homepage-sections">
        {searchResults ? (
          <div className="search-results-section">
            <div className="content-header">
              <h2>Search Results</h2>
              <p>Found {searchResults.length} matching title(s)</p>
            </div>
            {searchResults.length > 0 ? (
              <GameGrid games={searchResults} />
            ) : (
              <p className="no-search-results">No games found matching your search.</p>
            )}
          </div>
        ) : (
          <>
            <section className="top-video-games">
              <h2>Top Video Games</h2>
              <GameGrid games={videoGames.slice(0, 6)} />
            </section>

            <section className="top-board-games">
              <h2>Top Board Games</h2>
              <GameGrid games={boardGames.slice(0, 6)} />
            </section>
          </>
        )}
      </div>
    </div>
  );
}

export default HomePage;