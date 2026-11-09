// src/services/Steam.js
const API_KEY = import.meta.env.STEAM_KEY;

export async function getSteamGames() {
    const response = await fetch(`https://api.steampowered.com/ISteamApps/GetAppList/v2/?key=${API_KEY}`);
    const data = await response.json();
    return data.applist.apps;

    if (!response.ok) {
        throw new Error('Failed to fetch Steam games');
    }
};

