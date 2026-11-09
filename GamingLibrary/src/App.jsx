import Header from "./components/Header";
import Footer from "./components/Footer";
import HomePage from "./pages/HomePage";
import GameDetails from "./pages/GameDetails";
import { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

function App() {
  const [games, setGames] = useState([]);
  const [searchResults, setSearchResults] = useState([]);

  useEffect(() => {
    fetch("http://localhost:3000/games")
      .then((response) => response.json())
      .then((data) => setGames(data))
      .catch((error) => console.error("Error fetching games:", error));
  }, []);

  const handleSearch = (query) => {
    const results = games.filter((game) =>
      game.title.toLowerCase().includes(query.toLowerCase())
    );
    setSearchResults(results);
  };

  return (
    <BrowserRouter>
      <Header onSearch={handleSearch} />
      <Routes>
        <Route path="/" element={<Home games={searchResults.length > 0 ? searchResults : games} />} />
        <Route path="/games/:id" element={<GameDetails />} />
      </Routes>
      <Footer />
    </BrowserRouter>
  );
}

export default App;