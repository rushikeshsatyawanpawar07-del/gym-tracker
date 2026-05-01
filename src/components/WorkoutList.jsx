import React, { useEffect, useState } from "react";
import { getWorkouts } from "../services/api";
import WorkoutCard from "./WorkoutCard";
import "./WorkoutList.css";

function WorkoutList({ refresh, onRefreshDone }) {
  const [workouts, setWorkouts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchWorkouts = async () => {
    try {
      const data = await getWorkouts();
      setWorkouts(data);
      setError("");
    } catch (err) {
      setError("Failed to load workouts");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWorkouts();
  }, []);

  useEffect(() => {
    if (refresh) {
      fetchWorkouts();
      onRefreshDone();
    }
  }, [refresh, onRefreshDone]);

  const handleDelete = (id) => {
    setWorkouts(workouts.filter((w) => w._id !== id));
  };

  if (loading) {
    return (
      <div className="workout-list">
        <div className="loading">Loading workouts...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="workout-list">
        <p className="error-message">{error}</p>
      </div>
    );
  }

  return (
    <div className="workout-list">
      <div className="list-header">
        <h2 className="list-title">Workout History</h2>
        <span className="workout-count">{workouts.length} workout{workouts.length !== 1 ? "s" : ""}</span>
      </div>
      {workouts.length === 0 ? (
        <div className="empty-state">
          <span className="empty-icon">&#127947;</span>
          <p>No workouts yet. Log your first workout!</p>
        </div>
      ) : (
        <div className="cards-grid">
          {workouts.map((workout) => (
            <WorkoutCard key={workout._id} workout={workout} onDelete={handleDelete} />
          ))}
        </div>
      )}
    </div>
  );
}

export default WorkoutList;
