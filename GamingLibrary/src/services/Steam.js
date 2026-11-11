// src/services/Steam.js

export async function getSteamGames() {
    try {
        // Fetching featured/trending games directly from Steam's public featured endpoint
        const response = await fetch("https://store.steampowered.com/api/featured/");
        
        if (!response.ok) {
            throw new Error('Failed to fetch Steam games');
        }

        const data = await response.json();
        
        // Steam's featured endpoint returns categorized lists (like large_capsules, featured_win, etc.)
        // Let's combine them into a clean single array for your game grid
        const featuredList = data.featured_win || [];
        const formattedGames = featuredList.map(game => ({
            id: game.id,
            name: game.title,
            type: "Video Game",
            header_image: game.header_image,
            rating: "Featured",
            releaseDate: "Recent"
        }));

        return formattedGames.length > 0 ? formattedGames : getFallbackGames();
    } catch (error) {
        console.warn("API fetch blocked or failed, using fallback game list for MVP:", error);
        return getFallbackGames();
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
        return null;
    }
}

// Fallback dataset to ensure your pages always look great for your project presentation
function getFallbackGames() {
    return [
        { id: 730, name: "Counter-Strike 2", type: "Video Game", header_image: "https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/730/header.jpg", rating: "9/10", releaseDate: "2012" },
        { id: 570, name: "Dota 2", type: "Video Game", header_image: "https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/570/header.jpg", rating: "9/10", releaseDate: "2013" },
        { id: 1086940, name: "Baldur's Gate 3", type: "Video Game", header_image: "https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/1086940/header.jpg", rating: "10/10", releaseDate: "2023" },
        { id: 1172470, name: "Apex Legends", type: "Video Game", header_image: "https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/1172470/header.jpg", rating: "8/10", releaseDate: "2020" },
        { id: 1091500, name: "Cyberpunk 2077", type: "Video Game", header_image: "https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/1091500/header.jpg", rating: "9/10", releaseDate: "2020" },
        { id: 252490, name: "Rust", type: "Video Game", header_image: "https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/252490/header.jpg", rating: "8/10", releaseDate: "2018" }
    ];
}