// src/Pages/VideoGamesPage.jsx
import React, { useEffect, useState } from "react";
import GameGrid from "../components/GameGrid";
import LoadingSpinner from "../components/LoadingSpinner";
import { getSteamGames } from "../services/Steam";

function VideoGamesPage() {
  const [videoGames, setVideoGames] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchVideoGames() {
      try {
        setLoading(true);
        const data = await getSteamGames();
        setVideoGames(data);
      } catch (err) {
        console.error("Error fetching video games:", err);
        setError("Failed to load video games.");
      } finally {
        setLoading(false);
      }
    }

    fetchVideoGames();
  }, []);

  return (
    <div className="video-games-page" style={{ padding: "1rem" }}>
      <h1>Video Games</h1>
      {loading && <LoadingSpinner />}
      {error && <p style={{ color: "red" }}>{error}</p>}
      {!loading && !error && <GameGrid games={videoGames} />}
    </div>
  );
}

export default VideoGamesPage;