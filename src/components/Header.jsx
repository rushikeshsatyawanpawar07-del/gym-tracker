import React from "react";
import "./Header.css";

function Header() {
  return (
    <header className="header">
      <div className="header-content">
        <div className="logo">
          <span className="logo-icon">&#127947;</span>
          <h1>Gym Tracker</h1>
        </div>
        <p className="tagline">Track your gains. Crush your goals.</p>
      </div>
    </header>
  );
}

export default Header;
