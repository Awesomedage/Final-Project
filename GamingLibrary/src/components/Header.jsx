// src/components/Header.jsx
import './Header.css';
import { Link } from 'react-router-dom';
import { useState } from 'react';

function Header({ onSearch }) {
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = () => {
    if (searchQuery.trim() && onSearch) {
      onSearch(searchQuery);
    }
  };
    
  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <header className="header">
      <h1 className="header-title">Gaming Library</h1>
      <nav className="header-nav">
        <Link to="/" className="header-link">Home</Link>
        <Link to="/saved" className="header-link">Saved Games</Link>
      </nav>
      <div className="header-search">
        <input
          type="text"
          placeholder="Search games..."
          className="search-input"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onKeyPress={handleKeyPress}
        />
        <button className="search-button" onClick={handleSearch}>
          Search
        </button>
      </div>
    </header>
  );
}

export default Header;