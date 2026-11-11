// src/services/BoardGame.js

export async function searchBoardGames(query) {
  try {
    // Using the Vite proxy path to bypass browser CORS restrictions
    const response = await fetch(
      `/bgg-api/xmlapi2/search?query=${encodeURIComponent(query)}&type=boardgame`
    );

    if (!response.ok) {
      throw new Error("Failed to fetch board games");
    }

    const xmlText = await response.text();
    return xmlText;
  } catch (error) {
    console.error("Error searching board games:", error);
    throw error;
  }
}

export async function getBoardGameDetails(gameId) {
  try {
    const response = await fetch(
      `/bgg-api/xmlapi2/thing?id=${gameId}`
    );

    if (!response.ok) {
      throw new Error("Failed to fetch board game details");
    }

    const xmlText = await response.text();
    return xmlText;
  } catch (error) {
    console.error("Error fetching board game details:", error);
    throw error;
  }
}