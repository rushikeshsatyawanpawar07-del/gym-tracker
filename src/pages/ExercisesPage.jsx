import React from "react";
import { Link, useParams } from "react-router-dom";
import { muscleGroups, exercisesByMuscle } from "../data/exercises";
import "./ExercisesPage.css";

function ExercisesPage() {
  const { muscleId } = useParams();
  const group = muscleGroups.find((g) => g.id === muscleId);
  const exercises = exercisesByMuscle[muscleId] || [];

  if (!group) {
    return (
      <div className="exercises-page">
        <p>Muscle group not found.</p>
        <Link to="/">Go Home</Link>
      </div>
    );
  }

  return (
    <div className="exercises-page">
      <div className="exercises-header">
        <Link to="/" className="back-link">
          &#8592; Back
        </Link>
        <h1>
          <span style={{ color: group.color }}>{group.icon}</span> {group.name}
        </h1>
      </div>
      <div className="exercises-list">
        {exercises.map((exercise, index) => (
          <Link
            to={`/log/${muscleId}/${encodeURIComponent(exercise)}`}
            key={index}
            className="exercise-card-link"
          >
            <div className="exercise-card">
              <div className="exercise-number">{index + 1}</div>
              <span className="exercise-name">{exercise}</span>
              <span className="arrow">&#8594;</span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

export default ExercisesPage;
