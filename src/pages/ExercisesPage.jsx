import React from "react";
import { Link, useParams } from "react-router-dom";
import { muscleGroups, exercisesByMuscle } from "../data/exercises";
import { getTutorialUrl } from "../data/exerciseVideos";
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

  const openTutorial = (e, exercise) => {
    e.preventDefault();
    e.stopPropagation();
    window.open(getTutorialUrl(exercise), "_blank", "noopener");
  };

  return (
    <div className="exercises-page">
      <div className="exercises-header">
        <Link to="/" className="back-link">
          &#8592; Back
        </Link>
        <h1>
          {group.icon.startsWith("/")
            ? <img src={group.icon} alt="" className="ex-header-img" />
            : <span style={{ color: group.color }}>{group.icon}</span>
          }
          {" "}{group.name}
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
              <button
                className="tutorial-btn"
                onClick={(e) => openTutorial(e, exercise)}
                title="Watch tutorial on YouTube"
              >
                &#9654;
              </button>
              <span className="arrow">&#8594;</span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

export default ExercisesPage;
