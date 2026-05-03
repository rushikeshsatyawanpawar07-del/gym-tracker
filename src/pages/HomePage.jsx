import React from "react";
import { Link } from "react-router-dom";
import { muscleGroups, exercisesByMuscle } from "../data/exercises";
import "./HomePage.css";

function HomePage() {
  return (
    <div className="home">
      <div className="home-header">
        <h1>Gym Tracker</h1>
        <p>Select a muscle group to start logging</p>
      </div>
      <div className="muscle-grid">
        {muscleGroups.map((group) => (
          <Link to={`/exercises/${group.id}`} key={group.id} className="muscle-card-link">
            <div className="muscle-card" style={{ borderColor: group.color }}>
              <span className="muscle-icon" style={{ color: group.color }}>
                {group.icon}
              </span>
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
