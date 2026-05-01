import React from "react";
import { deleteWorkout } from "../services/api";
import "./WorkoutCard.css";

function WorkoutCard({ workout, onDelete }) {
  const date = new Date(workout.date).toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  const time = new Date(workout.date).toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
  });

  const handleDelete = async () => {
    if (window.confirm("Delete this workout?")) {
      await deleteWorkout(workout._id);
      onDelete(workout._id);
    }
  };

  return (
    <div className="workout-card">
      <div className="card-header">
        <h3 className="exercise-name">{workout.exercise}</h3>
        <button className="delete-btn" onClick={handleDelete} title="Delete">
          &#10005;
        </button>
      </div>
      <div className="card-stats">
        <div className="stat">
          <span className="stat-value">{workout.sets}</span>
          <span className="stat-label">Sets</span>
        </div>
        <div className="stat">
          <span className="stat-value">{workout.reps}</span>
          <span className="stat-label">Reps</span>
        </div>
        <div className="stat">
          <span className="stat-value">{workout.weight}</span>
          <span className="stat-label">KG</span>
        </div>
      </div>
      <div className="card-footer">
        <span className="card-date">{date}</span>
        <span className="card-time">{time}</span>
      </div>
    </div>
  );
}

export default WorkoutCard;
