import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { muscleGroups } from "../data/exercises";
import { getWorkouts, deleteWorkout } from "../services/api";
import "./HistoryPage.css";

function HistoryPage() {
  const { muscleId, exerciseName } = useParams();
  const group = muscleGroups.find((g) => g.id === muscleId);
  const decodedExercise = decodeURIComponent(exerciseName);

  const [workouts, setWorkouts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchWorkouts = async () => {
      try {
        const data = await getWorkouts();
        const filtered = data.filter(
          (w) => w.exercise.toLowerCase() === decodedExercise.toLowerCase()
        );
        setWorkouts(filtered);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchWorkouts();
  }, [decodedExercise]);

  const handleDelete = async (id) => {
    await deleteWorkout(id);
    setWorkouts((prev) => prev.filter((w) => w._id !== id));
  };

  const formatDate = (d) =>
    new Date(d).toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
    });

  const formatTime = (d) =>
    new Date(d).toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });

  return (
    <div className="history-page">
      <div className="history-header">
        <Link to={`/exercises/${muscleId}`} className="nav-btn">
          &#8592; Back
        </Link>
        <div className="history-title">
          <span className="muscle-badge" style={{ backgroundColor: group?.color }}>
            {group?.icon?.startsWith("/")
              ? <img src={group.icon} alt="" className="badge-img" />
              : group?.icon
            }
            {" "}{group?.name}
          </span>
          <h1>{decodedExercise}</h1>
          <p className="history-subtitle">Previous Workouts</p>
        </div>
      </div>

      {loading ? (
        <div className="history-loading">Loading...</div>
      ) : workouts.length === 0 ? (
        <div className="history-empty">
          <span className="empty-icon">&#128221;</span>
          <p>No saved workouts for this exercise yet.</p>
          <Link to={`/log/${muscleId}/${exerciseName}`} className="log-link">
            Log your first workout
          </Link>
        </div>
      ) : (
        <div className="history-list">
          <div className="history-stats">
            <div className="stat-box">
              <span className="stat-num">{workouts.length}</span>
              <span className="stat-lbl">Workouts</span>
            </div>
            <div className="stat-box">
              <span className="stat-num">
                {workouts.reduce((s, w) => s + w.sets * w.reps * w.weight, 0)}
              </span>
              <span className="stat-lbl">Total Vol</span>
            </div>
            <div className="stat-box">
              <span className="stat-num">
                {workouts.reduce((s, w) => s + w.sets, 0)}
              </span>
              <span className="stat-lbl">Total Sets</span>
            </div>
          </div>

          {workouts.map((w) => (
            <div key={w._id} className="history-card">
              <div className="history-card-top">
                <span className="history-date">{formatDate(w.date)}</span>
                <button
                  className="del-btn"
                  onClick={() => handleDelete(w._id)}
                  title="Delete"
                >
                  &#10005;
                </button>
              </div>
              <div className="history-card-stats">
                <div className="h-stat">
                  <span className="h-val">{w.sets}</span>
                  <span className="h-lbl">Sets</span>
                </div>
                <div className="h-stat">
                  <span className="h-val">{w.reps}</span>
                  <span className="h-lbl">Reps</span>
                </div>
                <div className="h-stat">
                  <span className="h-val">{w.weight}</span>
                  <span className="h-lbl">KG</span>
                </div>
                <div className="h-stat">
                  <span className="h-val">{w.sets * w.reps * w.weight}</span>
                  <span className="h-lbl">Volume</span>
                </div>
              </div>
              <div className="history-card-time">{formatTime(w.date)}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default HistoryPage;
