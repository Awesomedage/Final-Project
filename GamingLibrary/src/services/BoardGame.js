// src/services/BoardGame.js
export async function searchBoardGames(query) {
  const response = await fetch(
    `https://boardgamegeek.com/xmlapi2/search?query=${query}&type=boardgame`
  );

  if (!response.ok) {
    throw new Error("Failed to fetch board games");
  }

  const xmlText = await response.text();

  return xmlText;
}