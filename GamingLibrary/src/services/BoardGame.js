// src/services/BoardGame.js
const API_KEY = import.meta.env.BOARD_GAME_KEY;

export async function getBoardGames() {
    const response = await fetch(`https://api.boardgameatlas.com/api/search?client_id=${API_KEY}`);
    const data = await response.json();
    return data.games;

    if (!response.ok) {
        throw new Error('Failed to fetch board games');
    }
};