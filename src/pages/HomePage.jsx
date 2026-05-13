import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { muscleGroups, exercisesByMuscle } from "../data/exercises";
import "./HomePage.css";

function MuscleIcon({ icon, color }) {
  if (icon.startsWith("/")) {
    return <img src={icon} alt="" className="muscle-img" />;
  }
  return <span className="muscle-icon" style={{ color }}>{icon}</span>;
}

function HomePage() {
  const { user, logout } = useAuth();

  return (
    <div className="home">
      <nav className="top-nav">
        <div className="nav-user">
          {user?.photoURL ? (
            <img src={user.photoURL} alt="" className="nav-avatar" />
          ) : (
            <div className="nav-avatar-placeholder">
              {user?.displayName?.charAt(0) || "U"}
            </div>
          )}
          <span className="nav-name">{user?.displayName}</span>
        </div>
        <button className="nav-logout" onClick={logout}>Logout</button>
      </nav>
      <div className="home-header">
        <h1>Gym Tracker</h1>
        <p>Select a muscle group to start logging</p>
      </div>
      <div className="muscle-grid">
        {muscleGroups.map((group) => (
          <Link to={`/exercises/${group.id}`} key={group.id} className="muscle-card-link">
            <div className="muscle-card" style={{ borderColor: group.color }}>
              <MuscleIcon icon={group.icon} color={group.color} />
              <h3>{group.name}</h3>
              <span className="exercise-count">
                {exercisesByMuscle[group.id].length} exercises
              </span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

export default HomePage;
