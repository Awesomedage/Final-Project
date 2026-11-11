// src/components/Footer.jsx
import './Footer.css';
import { Link } from 'react-router-dom';

function Footer() {
  return (
    <footer className="footer">
      <p className="footer-title">&copy; 2026 Gaming Library. All rights reserved.</p>
      <p className="footer-contact">Phone: 1-800-GAMING</p>
      <p className="footer-contact">Email: InfoGame@gmail.com</p>
      <div className="footer-links">
        <Link to="/about" className="footer-link">About Us</Link>
        <Link to="/privacy" className="footer-link">Privacy Policy</Link>
      </div>
    </footer>
  );
}

export default Footer;