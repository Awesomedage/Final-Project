// src/App.jsx
import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import HomePage from "./Pages/HomePage";
import VideoGamesPage from "./Pages/VideoGamesPage";
import BoardGamesPage from "./Pages/BoardGamesPage";
import GameDetailPage from "./Pages/GameDetailPage";
import SavedPage from "./Pages/SavedPage";
import AboutPage from "./Pages/AboutPage";
import Header from "./components/Header";
import Footer from "./components/Footer";
import { getSteamGames } from "./services/Steam";
import { searchBoardGames, getFallbackBoardGames } from "./services/BoardGame";

function App() {
  const [savedGames, setSavedGames] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [allGames, setAllGames] = useState([]);
  const [liveBoardResults, setLiveBoardResults] = useState([]);

  // Pre-load games so instant search filtering works smoothly on the homepage
  useEffect(() => {
    async function loadGames() {
      try {
        const steam = await getSteamGames();
        const board = await searchBoardGames("");
        const boardList = board && board.length > 0 ? board : getFallbackBoardGames();
        setAllGames([...steam, ...boardList]);
      } catch (err) {
        console.error("Failed to load games for search:", err);
        setAllGames(getFallbackBoardGames());
      }
    }
    loadGames();
  }, []);

  const handleSearch = async (query) => {
    setSearchQuery(query);
    if (query.trim()) {
      try {
        const boardMatches = await searchBoardGames(query);
        setLiveBoardResults(boardMatches || []);
      } catch (err) {
        console.error("Board game search failed:", err);
        setLiveBoardResults([]);
      }
    } else {
      setLiveBoardResults([]);
    }
  };

  // Combine filtered pre-loaded games with live board game search matches (deduplicated by id)
  const searchResults = searchQuery.trim()
    ? Array.from(
        new Map(
          [
            ...allGames.filter(
              (game) =>
                game &&
                game.name &&
                game.name.toLowerCase().includes(searchQuery.toLowerCase())
            ),
            ...liveBoardResults.filter(
              (game) =>
                game &&
                game.name &&
                game.name.toLowerCase().includes(searchQuery.toLowerCase())
            ),
          ].map((game) => [String(game.id), game])
        ).values()
      )
    : null;

  return (
    <Router>
      <Header onSearch={handleSearch} />
      <main style={{ minHeight: "80vh" }}>
        <Routes>
          <Route path="/" element={<HomePage searchResults={searchResults} />} />
          <Route path="/video-games" element={<VideoGamesPage />} />
          <Route path="/board-games" element={<BoardGamesPage />} />
          <Route path="/game/:id" element={<GameDetailPage />} />
          <Route path="/saved" element={<SavedPage savedGames={savedGames} />} />
          <Route path="/about" element={<AboutPage />} />
        </Routes>
      </main>
      <Footer />
    </Router>
  );
}

export default App;