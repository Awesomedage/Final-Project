// src/Pages/GameDetailPage.jsx
import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { getSteamGameDetails } from "../services/Steam";
import { getBoardGameDetails } from "../services/BoardGame";

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
        // 1. Try fetching Steam game details first
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
        const boardGameDetailsXml = await getBoardGameDetails(id);
        if (boardGameDetailsXml) {
          // Simple XML parser helper to extract name and description for clean presentation
          const parser = new DOMParser();
          const xmlDoc = parser.parseFromString(boardGameDetailsXml, "text/xml");
          
          const nameElement = xmlDoc.querySelector("name[type='primary']") || xmlDoc.querySelector("name");
          const descElement = xmlDoc.querySelector("description");

          const gameName = nameElement ? nameElement.getAttribute("value") || nameElement.textContent : `Board Game #${id}`;
          const gameDesc = descElement ? descElement.textContent : "No description available for this board game.";

          setGame({
            name: gameName,
            description: gameDesc,
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
    <div className="game-detail-page" style={{ padding: "2rem" }}>
      <Link to="/" style={{ display: "inline-block", marginBottom: "1rem" }}>
        ← Back to Home
      </Link>

      {loading && <p>Loading game details...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}

      {!loading && !error && game && (
        <div className="game-detail-container">
          <h1>{game.name}</h1>
          {game.image && <img src={game.image} alt={game.name} style={{ maxWidth: "100%", borderRadius: "8px", marginBottom: "1rem" }} />}
          <p><strong>Type:</strong> {game.type}</p>
          <div className="game-description" style={{ marginTop: "1.5rem" }}>
            <h3>Description</h3>
            <div dangerouslySetInnerHTML={{ __html: game.description }} />
          </div>
        </div>
      )}
    </div>
  );
}

export default GameDetailPage;