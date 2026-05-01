import React, { useState } from "react";
import { addWorkout } from "../services/api";
import "./WorkoutForm.css";

function WorkoutForm({ onWorkoutAdded }) {
  const [formData, setFormData] = useState({
    exercise: "",
    sets: "",
    reps: "",
    weight: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError("");
    setSuccess(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.exercise || !formData.sets || !formData.reps || !formData.weight) {
      setError("All fields are required");
      return;
    }

    setLoading(true);
    setError("");
    setSuccess(false);

    try {
      await addWorkout({
        exercise: formData.exercise,
        sets: Number(formData.sets),
        reps: Number(formData.reps),
        weight: Number(formData.weight),
      });
      setFormData({ exercise: "", sets: "", reps: "", weight: "" });
      setSuccess(true);
      onWorkoutAdded();
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      setError("Failed to save workout. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="workout-form">
      <h2 className="form-title">Log Workout</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-grid">
          <div className="form-group">
            <label htmlFor="exercise">Exercise</label>
            <input
              type="text"
              id="exercise"
              name="exercise"
              placeholder="e.g. Bench Press"
              value={formData.exercise}
              onChange={handleChange}
            />
          </div>
          <div className="form-group">
            <label htmlFor="sets">Sets</label>
            <input
              type="number"
              id="sets"
              name="sets"
              placeholder="4"
              min="1"
              value={formData.sets}
              onChange={handleChange}
            />
          </div>
          <div className="form-group">
            <label htmlFor="reps">Reps</label>
            <input
              type="number"
              id="reps"
              name="reps"
              placeholder="10"
              min="1"
              value={formData.reps}
              onChange={handleChange}
            />
          </div>
          <div className="form-group">
            <label htmlFor="weight">Weight (kg)</label>
            <input
              type="number"
              id="weight"
              name="weight"
              placeholder="60"
              min="0"
              step="0.5"
              value={formData.weight}
              onChange={handleChange}
            />
          </div>
        </div>
        {error && <p className="form-error">{error}</p>}
        {success && <p className="form-success">Workout logged!</p>}
        <button type="submit" className="submit-btn" disabled={loading}>
          {loading ? "Saving..." : "Add Workout"}
        </button>
      </form>
    </div>
  );
}

export default WorkoutForm;
