import React, { useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { muscleGroups } from "../data/exercises";
import { addWorkout } from "../services/api";
import "./WorkoutLogPage.css";

function WorkoutLogPage() {
  const { muscleId, exerciseName } = useParams();
  const navigate = useNavigate();
  const group = muscleGroups.find((g) => g.id === muscleId);
  const decodedExercise = decodeURIComponent(exerciseName);

  const [sets, setSets] = useState("");
  const [reps, setReps] = useState("");
  const [weight, setWeight] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!sets || !reps || !weight) {
      setError("All fields are required");
      return;
    }
    setLoading(true);
    setError("");
    setSuccess(false);
    try {
      await addWorkout({
        exercise: decodedExercise,
        sets: Number(sets),
        reps: Number(reps),
        weight: Number(weight),
      });
      setSuccess(true);
      setTimeout(() => navigate(-1), 1500);
    } catch (err) {
      setError("Failed to save workout. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="log-page">
      <div className="log-header">
        <button onClick={() => navigate(-1)} className="back-btn">
          &#8592; Back
        </button>
      </div>
      <div className="log-form">
        <div className="exercise-info">
          <span className="muscle-badge" style={{ backgroundColor: group?.color }}>
            {group?.icon} {group?.name}
          </span>
          <h2>{decodedExercise}</h2>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="sets">Sets</label>
              <input
                type="number"
                id="sets"
                value={sets}
                onChange={(e) => setSets(e.target.value)}
                placeholder="4"
                min="1"
              />
            </div>
            <div className="form-group">
              <label htmlFor="reps">Reps</label>
              <input
                type="number"
                id="reps"
                value={reps}
                onChange={(e) => setReps(e.target.value)}
                placeholder="10"
                min="1"
              />
            </div>
            <div className="form-group">
              <label htmlFor="weight">Weight (kg)</label>
              <input
                type="number"
                id="weight"
                value={weight}
                onChange={(e) => setWeight(e.target.value)}
                placeholder="60"
                min="0"
                step="0.5"
              />
            </div>
          </div>
          {error && <p className="form-error">{error}</p>}
          {success && <p className="form-success">Saved! Going back...</p>}
          <button type="submit" className="save-btn" disabled={loading}>
            {loading ? "Saving..." : "Save Workout"}
          </button>
        </form>
        <div className="log-footer">
          <Link to={`/exercises/${muscleId}`}>
            &larr; Back to {group?.name} exercises
          </Link>
          <Link to="/">All muscle groups</Link>
        </div>
      </div>
    </div>
  );
}

export default WorkoutLogPage;
