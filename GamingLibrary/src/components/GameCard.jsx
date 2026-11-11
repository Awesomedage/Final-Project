// src/components/GameCard.jsx
import React from "react";
import { Link } from "react-router-dom";
import './GameCard.css';

function GameCard({ game }) {
  if (!game) return null;

  const id = game.appid || game.id; // Use appid for Steam games, id for Board games
  const name = game.name;
  const type = game.type || (game.appid ? "Video Game" : "Board Game");
  const releaseDate = game.releaseDate || game.release_date?.date || game.yearPublished || "N/A";
  const rating = game.rating || game.averageRating || "N/A";
  const image = game.header_image || game.image || "";
  return (
    <div className="game-card">
      {image && <img src={image} alt={name} className="game-card-img" />}
      <h3>{name}</h3>
      <p><strong>Type:</strong> {type}</p>
      <p><strong>Release/Year:</strong> {releaseDate}</p>
      <p><strong>Rating:</strong> {rating}</p>
      <Link to={`/game/${id}`}>
        View Details
      </Link>
    </div>
  );
}

export default GameCard;