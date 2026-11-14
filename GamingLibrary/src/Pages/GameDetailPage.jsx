// src/Pages/GameDetailPage.jsx
import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { getSteamGameDetails } from "../services/Steam";
import { getBoardGameDetails } from "../services/BoardGame";
import "./GameDetailPage.css";

function GameDetailPage() {
  const { id } = useParams();
  const [game, setGame] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchGameDetails() {
      setLoading(true);
      setError(null);

      try {
        // 1. Try fetching Steam game details
        const steamGameDetails = await getSteamGameDetails(id);
        if (steamGameDetails) {
          setGame({
            name: steamGameDetails.name,
            description: steamGameDetails.short_description || steamGameDetails.detailed_description,
            image: steamGameDetails.header_image,
            type: "Video Game",
          });
          setLoading(false);
          return;
        }

        // 2. Try fetching Board Game details
        const boardGameDetails = await getBoardGameDetails(id);
        if (boardGameDetails) {
          setGame({
            name: boardGameDetails.name,
            description: boardGameDetails.description,
            image: boardGameDetails.image,
            type: "Board Game",
          });
          setLoading(false);
          return;
        }

        setError("Game not found");
      } catch (err) {
        console.error(err);
        setError("Failed to fetch game details");
      } finally {
        setLoading(false);
      }
    }

    if (id) {
      fetchGameDetails();
    }
  }, [id]);

  return (
    <div className="game-detail-page">
      <Link to="/" className="back-link">
        ← Back to Home
      </Link>

      {loading && <p>Loading...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}

      {!loading && !error && game && (
        <div className="game-detail-container">
          <h1 className="game-detail-title">{game.name}</h1>
          
          {game.image && (
            <div className="game-image-wrapper">
              <img 
                src={game.image} 
                alt={game.name} 
                className="game-detail-img" 
              />
            </div>
          )}

          <p className="game-type-text"><strong>Type:</strong> {game.type}</p>
          
          <div className="game-description">
            <h3>Description</h3>
            <div dangerouslySetInnerHTML={{ __html: game.description }} />
          </div>
        </div>
      )}
    </div>
  );
}

export default GameDetailPage;