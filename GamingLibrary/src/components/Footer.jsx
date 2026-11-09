import './Footer.css';

function Footer() {
  return (
    <footer className="footer">
        <p className="footer-title">&copy; 2026 Gaming Library. All rights reserved.</p>
        <h1 className="footer-contact">Phone: 1-800-GAMING
        </h1>
        <h2 className="footer-contact">Email: InfoGame@gmail.com
        </h2>
        <div className="footer-links">
            <a href="#" className="footer-link">About Us</a>
            <a href="#" className="footer-link">Privacy Policy</a>
        </div>
    </footer>
    );
}

export default Footer;