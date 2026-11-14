// src/services/Steam.js

export async function getSteamGames() {
    try {
        // Fetching through the local Vite dev proxy to bypass browser CORS blocks
        const response = await fetch("/steam-api/api/featured/");
        
        if (!response.ok) {
            throw new Error('Failed to fetch Steam games');
        }

        const data = await response.json();
        
        // Steam's featured endpoint returns categorized lists (like featured_win, etc.)
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
        console.warn("Proxy fetch failed, using fallback game list for MVP:", error);
        return getFallbackGames();
    }
}

export async function getSteamGameDetails(appId) {
    try {
        // Fetching details through the local Vite proxy
        const response = await fetch(
            `/steam-api/api/appdetails?appids=${appId}`
        );

        if (!response.ok) {
            throw new Error('Failed to fetch Steam game details');
        }

        const data = await response.json();
        return data[appId]?.data || null;
    } catch (error) {
        console.error("Error fetching Steam game details, checking fallback:", error);
        // Fallback lookup if proxy/network fails
        const fallbackList = getFallbackGames();
        const found = fallbackList.find(game => String(game.id) === String(appId));
        if (found) {
            return {
                name: found.name,
                short_description: "This is a popular video game loaded from your fallback library catalog.",
                header_image: found.header_image,
            };
        }
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