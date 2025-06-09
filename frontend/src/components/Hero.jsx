"use client"

import {
  LuSprout,
  LuTractor,
  LuWheat,
  LuLeaf,
  LuUsers,
  LuTrendingUp,
  LuShield,
  LuArrowRight,
  LuPlay,
} from "react-icons/lu"
import heroImg from "../pictures/hero1.jpg"

export default function Hero() {
  return (
    <section className="hero">
      <div className="hero-container">
        <div className="hero-content">
          <div className="hero-text">
            <h1 className="hero-title">
              Revolutionizing Agriculture with
              <span className="hero-highlight"> Smart Solutions</span>
            </h1>
            <p className="hero-description">
              Connect with modern farming technology, premium agricultural products, and expert consultation services.
              Join thousands of farmers who are already growing smarter and harvesting better with Kheti.
            </p>
            <div className="hero-stats">
              <div className="stat-item">
                <LuUsers className="stat-icon" />
                <div className="stat-content">
                  <span className="stat-number">10,000+</span>
                  <span className="stat-label">Happy Farmers</span>
                </div>
              </div>
              <div className="stat-item">
                <LuTrendingUp className="stat-icon" />
                <div className="stat-content">
                  <span className="stat-number">40%</span>
                  <span className="stat-label">Yield Increase</span>
                </div>
              </div>
              <div className="stat-item">
                <LuShield className="stat-icon" />
                <div className="stat-content">
                  <span className="stat-number">100%</span>
                  <span className="stat-label">Quality Guaranteed</span>
                </div>
              </div>
            </div>
            <div className="hero-actions">
              <button className="hero-button primary">
                Get Started Today
                <LuArrowRight className="button-icon" />
              </button>
              <button className="hero-button secondary">
                <LuPlay className="button-icon" />
                Watch Demo
              </button>
            </div>
          </div>
          <div className="hero-visual">
            <div className="hero-image">
              <img src={heroImg} alt="Modern Agriculture" className="hero-img" />
              <div className="hero-features">
                <div className="feature-card">
                  <LuSprout className="feature-icon" />
                  <span>Premium Seeds</span>
                </div>
                <div className="feature-card">
                  <LuTractor className="feature-icon" />
                  <span>Modern Equipment</span>
                </div>
                <div className="feature-card">
                  <LuWheat className="feature-icon" />
                  <span>High Yield Crops</span>
                </div>
                <div className="feature-card">
                  <LuLeaf className="feature-icon" />
                  <span>Organic Solutions</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
