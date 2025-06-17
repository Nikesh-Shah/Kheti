import {
  LuSprout,
  LuMail,
  LuPhone,
  LuMapPin,
  LuFacebook,
  LuTwitter,
  LuInstagram,
  LuLinkedin,
  LuYoutube,
  LuArrowUp,
  LuLeaf,
  LuTractor,
  LuWheat,
} from "react-icons/lu"
import "../Styles/Footer.css"

export default function Footer() {
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    })
  }

  return (
    <footer className="footer">
      {/* Main Footer Content */}
      <div className="footer-container">
        <div className="footer-content">
          {/* Company Info */}
          <div className="footer-section">
            <div className="footer-logo">
              <div className="footer-logo-icon">
                <LuSprout className="logo-icon" />
              </div>
              <span className="footer-logo-text">Kheti</span>
            </div>
            <p className="footer-description">
              Connecting farmers with modern agricultural solutions. Growing together, harvesting success through
              innovative technology and sustainable farming practices.
            </p>
            <div className="footer-social">
              <a href="#" className="social-link" aria-label="Facebook">
                <LuFacebook className="social-icon" />
              </a>
              <a href="#" className="social-link" aria-label="Twitter">
                <LuTwitter className="social-icon" />
              </a>
              <a href="#" className="social-link" aria-label="Instagram">
                <LuInstagram className="social-icon" />
              </a>
              <a href="#" className="social-link" aria-label="LinkedIn">
                <LuLinkedin className="social-icon" />
              </a>
              <a href="#" className="social-link" aria-label="YouTube">
                <LuYoutube className="social-icon" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="footer-section">
            <h3 className="footer-title">Quick Links</h3>
            <ul className="footer-links">
              <li>
                <a href="#home" className="footer-link">
                  Home
                </a>
              </li>
              <li>
                <a href="#about" className="footer-link">
                  About Us
                </a>
              </li>
              <li>
                <a href="#products" className="footer-link">
                  Products
                </a>
              </li>
              <li>
                <a href="#services" className="footer-link">
                  Services
                </a>
              </li>
              <li>
                <a href="#blog" className="footer-link">
                  Blog
                </a>
              </li>
              <li>
                <a href="#contact" className="footer-link">
                  Contact
                </a>
              </li>
            </ul>
          </div>

          {/* Products & Services */}
          <div className="footer-section">
            <h3 className="footer-title">Our Solutions</h3>
            <ul className="footer-links">
              <li>
                <a href="#seeds" className="footer-link">
                  <LuWheat className="link-icon" />
                  Seeds & Crops
                </a>
              </li>
              <li>
                <a href="#equipment" className="footer-link">
                  <LuTractor className="link-icon" />
                  Farm Equipment
                </a>
              </li>
              <li>
                <a href="#fertilizers" className="footer-link">
                  <LuLeaf className="link-icon" />
                  Fertilizers
                </a>
              </li>
              <li>
                <a href="#consultation" className="footer-link">
                  Farm Consultation
                </a>
              </li>
              <li>
                <a href="#weather" className="footer-link">
                  Weather Monitoring
                </a>
              </li>
              <li>
                <a href="#marketplace" className="footer-link">
                  Marketplace
                </a>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div className="footer-section">
            <h3 className="footer-title">Get In Touch</h3>
            <div className="footer-contact">
              <div className="contact-item">
                <LuMapPin className="contact-icon" />
                <div className="contact-info">
                  <p>123 Agriculture Street</p>
                  <p>Farm Valley, FV 12345</p>
                </div>
              </div>
              <div className="contact-item">
                <LuPhone className="contact-icon" />
                <div className="contact-info">
                  <p>+1 (555) 123-4567</p>
                  <p>+1 (555) 987-6543</p>
                </div>
              </div>
              <div className="contact-item">
                <LuMail className="contact-icon" />
                <div className="contact-info">
                  <p>info@Kheti.com</p>
                  <p>support@Kheti.com</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Newsletter Signup */}
        <div className="newsletter-section">
          <div className="newsletter-content">
            <div className="newsletter-info">
              <h3 className="newsletter-title">Stay Updated</h3>
              <p className="newsletter-description">
                Subscribe to our newsletter for the latest agricultural insights, product updates, and farming tips.
              </p>
            </div>
            <form className="newsletter-form">
              <div className="newsletter-input-group">
                <input type="email" placeholder="Enter your email address" className="newsletter-input" />
                <button type="submit" className="newsletter-button">
                  Subscribe
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Bottom Footer */}
        <div className="footer-bottom">
          <div className="footer-bottom-content">
            <div className="footer-copyright">
              <p>&copy; 2024 Kheti. All rights reserved.</p>
            </div>
            <div className="footer-legal">
              <a href="#privacy" className="legal-link">
                Privacy Policy
              </a>
              <a href="#terms" className="legal-link">
                Terms of Service
              </a>
              <a href="#cookies" className="legal-link">
                Cookie Policy
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll to Top Button */}
      <button className="scroll-to-top" onClick={scrollToTop} aria-label="Scroll to top">
        <LuArrowUp className="scroll-icon" />
      </button>
    </footer>
  )
}
