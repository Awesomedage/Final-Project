// src/App.jsx
import React, { useState } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import HomePage from "./Pages/HomePage";
import VideoGamesPage from "./Pages/VideoGamesPage";
import BoardGamesPage from "./Pages/BoardGamesPage";
import GameDetailPage from "./Pages/GameDetailPage";
import SavedPage from "./Pages/SavedPage";
import AboutPage from "./Pages/AboutPage";
import Header from "./components/Header";
import Footer from "./components/Footer";

function App() {
  const [savedGames, setSavedGames] = useState([]);

  const handleSearchNavigation = (query) => {
    // You can route or filter based on search query here
    console.log("Searching for:", query);
  };

  return (
    <Router>
      <Header onSearch={handleSearchNavigation} />
      <main style={{ minHeight: "80vh" }}>
        <Routes>
          <Route path="/" element={<HomePage />} />
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