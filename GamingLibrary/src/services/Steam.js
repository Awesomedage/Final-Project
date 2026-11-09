// src/services/Steam.js
const API_KEY = import.meta.env.VITE_STEAM_KEY;

export async function getSteamGames() {
    const response = await fetch(
        `https://api.steampowered.com/ISteamApps/GetAppList/v2/?key=${API_KEY}`
    );


    if (!response.ok) {
        throw new Error('Failed to fetch Steam games');
    }
const data = await response.json();
    return data.applist.apps;
};

