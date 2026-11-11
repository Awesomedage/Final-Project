// src/services/Steam.js
const API_KEY = import.meta.env.VITE_STEAM_KEY;

export async function getSteamGames() {
    try {
        // Using the Vite proxy path to bypass browser CORS restrictions
        const response = await fetch(
            `/steam-api/ISteamApps/GetAppList/v2/?key=${API_KEY}`
        );

        if (!response.ok) {
            throw new Error('Failed to fetch Steam games');
        }

        const data = await response.json();
        // Slicing to the first 100 apps to keep performance fast for the MVP
        return data.applist.apps.slice(0, 100); 
    } catch (error) {
        console.error("Error fetching Steam games:", error);
        throw error;
    }
}

export async function getSteamGameDetails(appId) {
    try {
        const response = await fetch(
            `https://store.steampowered.com/api/appdetails?appids=${appId}`
        );

        if (!response.ok) {
            throw new Error('Failed to fetch Steam game details');
        }

        const data = await response.json();
        return data[appId]?.data || null;
    } catch (error) {
        console.error("Error fetching Steam game details:", error);
        throw error;
    }
}