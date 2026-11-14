# Gaming Library

## Project Description and Purpose
**Gaming Library** is a single-page web application that enables users to discover, search, inspect, and bookmark both video games and tabletop board games in one unified catalog. Rather than switching between separate storefronts and databases, users can browse curated lists of popular PC titles and classic board games, view game descriptions and release details, and maintain a persistent personal collection of saved favorites.

---

## Technologies Used
* **Frontend Framework:** React (Functional Components, Hooks: `useState`, `useEffect`)
* **Routing:** React Router (`BrowserRouter`, `Routes`, `Route`, `Link`, `useParams`)
* **Styling:** Custom modular CSS (`HomePage.css`, `BoardGamesPage.css`, `GameDetailPage.css`, `Header.css`, `GameCard.css`) with responsive media queries
* **Build Tool & Dev Server:** Vite (`vite.config.js` with custom API proxy configuration)
* **State Persistence:** Browser `localStorage` API for saving and retrieving user game collections
* **Testing Suite:** Vitest, `jsdom`, React Testing Library (`@testing-library/react`), and `@testing-library/jest-dom`

---

## Setup and Installation Instructions

1. **Clone the repository:**
   ```bash
   git clone <your-repository-url>
   cd GamingLibrary
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start the local development server:**
   ```bash
   npm run dev
   ```
   Open the local URL displayed in your terminal (typically `http://localhost:5173`).

4. **Run the automated test suite:**
   ```bash
   npm test
   ```

## Available Routes and Features

| Route | Page Component | Description & Key Features |
| :--- | :--- | :--- |
| `/` | `HomePage` | Displays the hero welcome banner, quick category navigation buttons, top video games, top board games, and unified search results. |
| `/video-games` | `VideoGamesPage` | Fetches and displays a grid of PC video games from the Steam service with loading and error states[cite: 8]. |
| `/board-games` | `BoardGamesPage` | Fetches and displays tabletop board games from BoardGameGeek with automatic fallback data[cite: 5]. |
| `/game/:id` | `GameDetailPage` | Dynamically resolves game details by ID across Steam and BoardGameGeek services, displaying cover art, game type, and HTML descriptions[cite: 6]. |
| `/saved` | `SavedPage` | Reads from `localStorage` to display all games the user has bookmarked, or an empty-state prompt if none are saved[cite: 7]. |
| `/about` | `AboutPage` | Displays information about the Gaming Library application. |

### Core Application Features
* **Global Search Bar (`Header`):** Allows users to submit queries via the Search button or `Enter` key to filter games from the home view[cite: 9].
* **Interactive Game Cards (`GameCard`):** Displays cover artwork, title, game type (`Video Game` or `Board Game`), release date/year, rating, a link to `/game/:id`, and a toggleable **Save Game / Unsave** button synced with `localStorage`[cite: 10].
* **Responsive Layout:** Uses CSS Grid (`auto-fill`, `minmax(220px, 1fr)`) for game cards and responsive breakpoints (`768px` and `1024px`) for page padding[cite: 4, 13].

---

## API Documentation and Dependencies

### External APIs & Vite Proxy Configuration
To avoid browser CORS restrictions during local development, `vite.config.js` proxies requests to two external gaming APIs[cite: 3]:

1. **Steam Store API**
   * **Proxy Path:** `/steam-api` $\rightarrow$ `https://store.steampowered.com`[cite: 3]
   * **Service Module:** `src/services/Steam.js`
   * **Methods:**
     * `getSteamGames()` — Fetches featured/popular video games[cite: 8].
     * `getSteamGameDetails(id)` — Retrieves detailed metadata (`name`, `short_description`, `detailed_description`, `header_image`) for a specific Steam App ID[cite: 6].

2. **BoardGameGeek (BGG) XML API**
   * **Proxy Path:** `/bgg-api` $\rightarrow$ `https://boardgamegeek.com`[cite: 3]
   * **Service Module:** `src/services/BoardGame.js`
   * **Methods:**
     * `searchBoardGames(query)` — Queries BGG for tabletop titles matching the search term[cite: 2, 5].
     * `getBoardGameDetails(id)` — Retrieves detailed board game information (`name`, `description`, `image`) by BGG ID[cite: 6].
     * `getFallbackBoardGames()` — Returns a curated local fallback list of board games if the BGG API queues or fails to respond[cite: 5].

### Key Package Dependencies
* `react` & `react-dom`
* `react-router-dom`
* `vite` & `@vitejs/plugin-react`
* `vitest`, `jsdom`, `@testing-library/react`, `@testing-library/jest-dom`

---

## Deployment URL and Instructions

* **Live Deployment URL:** `[Insert Your Live Vercel / Netlify / GitHub Pages URL Here]`

### Deployment Instructions (Vercel / Netlify)
1. Push your project repository to GitHub.
2. Import the repository into your hosting provider (e.g., Vercel or Netlify).
3. Configure the build settings:
   * **Build Command:** `npm run build`
   * **Output Directory:** `dist`
4. Configure production rewrites/redirects for `/steam-api/*` and `/bgg-api/*` (matching the proxy targets in `vite.config.js`[cite: 3]) as well as SPA fallback routing (`/*` $\rightarrow$ `/index.html`) so direct visits to routes like `/saved` or `/game/:id` resolve properly.

---

## Screenshots


---

## Known Issues
* **Search Result Scope & Thumbnail Caching:** Header search currently queries live results primarily against the board game service and may occasionally reuse or display mismatched thumbnail imagery (such as Catan's cover image) on the homepage view.
* **BoardGameGeek API Queuing:** The BGG XML API occasionally returns a `202 Accepted` queued response under heavy traffic; when this occurs, the app gracefully falls back to `getFallbackBoardGames()`.
* **Production Proxy Requirements:** Vite's `server.proxy` configuration only runs in local development (`npm run dev`), so production hosts require equivalent serverless functions or edge rewrites to proxy Steam and BGG API requests.

---

## Upcoming Future Enhancement Plans
* **Unified Cross-Platform Search:** Expand live search queries to hit both the Steam Store API and BoardGameGeek API simultaneously and strictly bind image URLs per game ID.
* **Filtering and Sorting Controls:**  I plan on creating a filter to  
* **User Accounts & Login system:** I plan on adding a login system and user accounts, so your saved list will be saved.

