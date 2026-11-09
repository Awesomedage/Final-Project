// src/App.jsx
import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import HomePage from "./Pages/HomePage";
import BoardGamesPage from "./Pages/BoardGamesPage";
import GameDetailPage from "./Pages/GameDetailPage";
import Header from "./components/Header";
import Footer from "./components/Footer";

function App() {
  return (
    <Router>
      <Header />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/board-games" element={<BoardGamesPage />} />
        <Route path="/game/:id" element={<GameDetailPage />} />
      </Routes>
      <Footer />
    </Router>
  );
}

export default App;