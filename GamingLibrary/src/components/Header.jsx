import './Header.css';
import { link } from 'react-router-dom';
import { useState } from 'react';

function Header({onSearch}) {
const [searchQuery, setSearchQuery] = useState('');

const handleSearch = () => {
    if (searchQuery.trim()){
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
        <a href="/" className="header-link">Home</a>
        <a href="/video-games" className="header-link">Video Games</a>
        <a href="/board-games" className="header-link">Board Games</a>
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
