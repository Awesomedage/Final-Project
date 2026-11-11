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

        // 2. If Steam fails/returns null, try Board Game details
        const boardGameDetails = await getBoardGameDetails(id);
        if (boardGameDetails) {
          // Note: boardGameDetails returns XML text from BGG
          setGame({
            name: "Board Game #" + id,
            description: boardGameDetails,
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
      <Link to="/" style={{ display: "inline-block", marginBottom: "1rem" }}>
        ← Back to Home
      </Link>

      {loading && <p>Loading...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}

      {!loading && !error && game && (
        <div className="game-detail-container">
          <h1>{game.name}</h1>
          {game.image && <img src={game.image} alt={game.name} style={{ maxWidth: "100%", borderRadius: "8px" }} />}
          <p><strong>Type:</strong> {game.type}</p>
          <div className="game-description">
            <h3>Description</h3>
            {/* Using dangerouslySetInnerHTML if description contains HTML markup from API */}
            <div dangerouslySetInnerHTML={{ __html: game.description }} />
          </div>
        </div>
      )}
    </div>
  );
}

export default GameDetailPage;