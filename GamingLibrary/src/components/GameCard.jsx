// src/components/GameCard.jsx
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "./GameCard.css";

function GameCard({ game }) {
  if (!game) return null;
  
  const id = game.id || game.appid;
  const name = game.name;
  
  // Explicitly check if it's explicitly defined or fallback based on presence of appid/type
  const type = game.type || (game.appid ? "Video Game" : "Board Game");
  
  const releaseDate = game.releaseDate || game.release_date?.date || game.yearPublished || "N/A";
  const rating = game.rating || game.averageRating || "N/A";
  const image = game.header_image || game.image || "";

const [isSaved, setIsSaved] = useState(false);

  // Check initial saved status on load
  useEffect(() => {
    const savedGames = JSON.parse(localStorage.getItem("savedGames")) || [];
    const savedStatus = savedGames.some(savedGame => String(savedGame.id) === String(id));
    setIsSaved(savedStatus);
  }, [id]);

  const handleSaveGame = () => {
    const savedGames = JSON.parse(localStorage.getItem("savedGames")) || [];
    const isAlreadySaved = savedGames.some(savedGame => String(savedGame.id) === String(id));
    
    if (!isAlreadySaved) {
      // Add game to saved list and save to localStorage
      savedGames.push({ id, name, type, releaseDate, rating, image });
      localStorage.setItem("savedGames", JSON.stringify(savedGames));
    } else {
      // Remove game from saved games list
      const updatedGames = savedGames.filter(savedGame => String(savedGame.id) !== String(id));
      localStorage.setItem("savedGames", JSON.stringify(updatedGames));
    }
    setIsSaved(!isAlreadySaved);
  };

  return (
    <div className="game-card">
      {image && <img src={image} alt={name} className="game-card-img" />}
      <h3>{name}</h3>
      <p><strong>Type:</strong> {type}</p>
      <p><strong>Release/Year:</strong> {releaseDate}</p>
      <p><strong>Rating:</strong> {rating}</p>
      <div className="game-card-actions" style={{ display: "flex", gap: "0.5rem", marginTop: "1rem" }}>
        <Link 
          to={`/game/${id}`} 
          className="btn-details" 
          style={{ padding: "0.4rem 0.8rem", 
            background: "#007bff", 
            color: "#fff", 
            textDecoration: "none", 
            borderRadius: "4px", 
            fontSize: "0.9rem" }}
        >
          Details
        </Link>
        <button 
          onClick={handleSaveGame} 
          style={{ 
            padding: "0.4rem 0.8rem", 
            background: isSaved ? "#dc3545" : "#28a745", 
            color: "#fff", 
            border: "none", 
            borderRadius: "4px", 
            cursor: "pointer",
            fontSize: "0.9rem"
          }}
        >
          {isSaved ? "Unsave" : "Save Game"}
        </button>
      </div>
    </div>
  );
}

export default GameCard;