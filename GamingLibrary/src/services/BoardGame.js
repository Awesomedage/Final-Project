// src/services/BoardGame.js

const BGG_TOKEN = import.meta.env.VITE_BOARD_GAME_KEY;

export async function searchBoardGames(query = "") {
  try {
    let response = await fetch(
      `/bgg-api/xmlapi2/search?query=${encodeURIComponent(query)}&type=boardgame`,
      {
        headers: {
          'Authorization': `Bearer ${BGG_TOKEN}`
        }
      }
    );

    if (response.status === 202) {
      await new Promise(resolve => setTimeout(resolve, 2000));
      response = await fetch(
        `/bgg-api/xmlapi2/search?query=${encodeURIComponent(query)}&type=boardgame`,
        {
          headers: {
            'Authorization': `Bearer ${BGG_TOKEN}`
          }
        }
      );
    }

    if (!response.ok) {
      throw new Error(`BGG API error: ${response.status}`);
    }

    const xmlText = await response.text();
    if (xmlText.includes("Please try again later")) {
      return getFallbackBoardGames();
    }

    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(xmlText, "text/xml");
    const items = xmlDoc.getElementsByTagName("item");

    const games = [];
    const limit = Math.min(items.length, 10);
    
    for (let i = 0; i < limit; i++) {
      const item = items[i];
      const id = item.getAttribute("id");
      const nameElem = item.getElementsByTagName("name")[0];
      const name = nameElem ? nameElem.getAttribute("value") : "Unknown Board Game";
      const yearElem = item.getElementsByTagName("yearpublished")[0];
      const releaseDate = yearElem ? yearElem.getAttribute("value") : "N/A";

      const fallbackMatch = getFallbackBoardGames().find(g => g.id === id);

      games.push({
        id,
        name,
        type: "Board Game",
        image: fallbackMatch ? fallbackMatch.image : "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQZ8wB7gSQyEIrBdZOhc3duFVi19Ib6YaWf7cpm8CWQAw&s",
        rating: fallbackMatch ? fallbackMatch.rating : "N/A",
        releaseDate
      });
    }

    return games.length > 0 ? games : getFallbackBoardGames();
  } catch (error) {
    console.warn("BGG search failed, using fallback list:", error);
    return getFallbackBoardGames();
  }
}

export async function getBoardGameDetails(gameId) {
  try {
    const response = await fetch(
      `/bgg-api/xmlapi2/thing?id=${gameId}`,
      {
        headers: {
          'Authorization': `Bearer ${BGG_TOKEN}`
        }
      }
    );

    if (!response.ok) {
      throw new Error(`BGG API error: ${response.status}`);
    }

    const xmlText = await response.text();
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(xmlText, "text/xml");
    
    const item = xmlDoc.getElementsByTagName("item")[0];
    if (!item) throw new Error("Item not found in XML");

    const nameElem = item.getElementsByTagName("name")[0];
    const name = nameElem ? nameElem.getAttribute("value") : "Board Game #" + gameId;
    
    const descElem = item.getElementsByTagName("description")[0];
    const description = descElem ? descElem.textContent : "No description available.";
    
    const imageElem = item.getElementsByTagName("image")[0];
    let image = imageElem ? imageElem.textContent : "";

    // If API didn't return an image, check fallback catalog
    if (!image) {
      const fallbackMatch = getFallbackBoardGames().find(g => String(g.id) === String(gameId));
      image = fallbackMatch ? fallbackMatch.image : "";
    }

    return {
      name,
      description,
      image,
      type: "Board Game"
    };
  } catch (error) {
    console.warn("BGG details fetch failed, checking fallback details:", error);
    const fallbackMatch = getFallbackBoardGames().find(g => String(g.id) === String(gameId));
    if (fallbackMatch) {
      return {
        name: fallbackMatch.name,
        description: `<strong>${fallbackMatch.name}</strong> is a classic tabletop board game released in ${fallbackMatch.releaseDate} with an average user rating of ${fallbackMatch.rating}/10. Enjoy strategic gameplay with friends and family!`,
        image: fallbackMatch.image,
        type: "Board Game"
      };
    }
    return null;
  }
}

// Fallback dataset using reliable image links so you don't get 400 errors
export function getFallbackBoardGames() {
  return [
    { id: "13", name: "Catan", type: "Board Game", image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQZ8wB7gSQyEIrBdZOhc3duFVi19Ib6YaWf7cpm8CWQAw&s", rating: "7.2", releaseDate: "1995" },
    { id: "30549", name: "Pandemic", type: "Board Game", image: "https://cf.geekdo-images.com/S3ybV1LAp-8SnHIXLLjVqA__itemrep/img/wAMLbgihOl7dJDHnvqt7OXKEV-4=/fit-in/246x300/filters:strip_icc()/pic1534148.jpg", rating: "7.6", releaseDate: "2008" },
    { id: "170416", name: "Scythe", type: "Board Game", image: "https://cf.geekdo-images.com/7k_nOxpO9OGIjhLq2BUZdA__itemrep/img/RVh5N-_HcMziJ3M6Q1eLTlj8XIQ=/fit-in/246x300/filters:strip_icc()/pic3163924.jpg", rating: "8.2", releaseDate: "2016" },
    { id: "167791", name: "Terraforming Mars", type: "Board Game", image: "https://cf.geekdo-images.com/wg9oOLcsKvDesSUdZQ4rxw__itemrep/img/IwUOQfhP5c0KcRJBY4X_hi3LpsY=/fit-in/246x300/filters:strip_icc()/pic3536616.jpg", rating: "8.4", releaseDate: "2016" },
    { id: "224517", name: "Brass: Birmingham", type: "Board Game", image: "https://cf.geekdo-images.com/x3zxjr-Vw5iU4yDPg70Jgw__itemrep/img/giNUMut4HAl-zWyQkGG0YchmuLI=/fit-in/246x300/filters:strip_icc()/pic3490053.jpg", rating: "8.6", releaseDate: "2018" },
    { id: "233090", name: "Gloomhaven", type: "Board Game", image: "https://cf.geekdo-images.com/sZYp_3BTDGjh2unaZfZmuA__itemrep/img/0IdBRA_G-ZdrNaxI4Z1LPQMZD0I=/fit-in/246x300/filters:strip_icc()/pic2437871.jpg", rating: "8.7", releaseDate: "2017" }
  ];
}