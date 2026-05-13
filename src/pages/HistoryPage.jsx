import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { muscleGroups } from "../data/exercises";
import { getWorkouts, deleteWorkout, getPRs } from "../services/api";
import "./HistoryPage.css";

function HistoryPage() {
  const { user } = useAuth();
  const { muscleId, exerciseName } = useParams();
  const group = muscleGroups.find((g) => g.id === muscleId);
  const decodedExercise = decodeURIComponent(exerciseName);

  const [workouts, setWorkouts] = useState([]);
  const [prs, setPrs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    const fetchData = async () => {
      try {
        const workoutData = await getWorkouts(user.uid);
        const filtered = workoutData.filter(
          (w) => w.exercise.toLowerCase() === decodedExercise.toLowerCase()
        );
        setWorkouts(filtered);
      } catch (err) {
        console.error("Failed to fetch workouts:", err);
      }
      try {
        const prData = await getPRs(decodedExercise, user.uid);
        setPrs(prData);
      } catch (err) {
        console.error("Failed to fetch PRs:", err);
      }
      setLoading(false);
    };
    fetchData();
  }, [decodedExercise, user]);

  const isWorkoutPR = (workoutId) => prs.some((p) => p._id === workoutId);
  const getPRTypes = (workoutId) => {
    const found = prs.find((p) => p._id === workoutId);
    return found ? found.prTypes : [];
  };
  const getEstimated1RM = (workoutId) => {
    const found = prs.find((p) => p._id === workoutId);
    return found ? found.estimated1RM : null;
  };

  const handleDelete = async (id) => {
    await deleteWorkout(id, user.uid);
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
            <div className="stat-box pr-stat-box">
              <span className="stat-num pr-stat-num">{prs.length}</span>
              <span className="stat-lbl">PRs</span>
            </div>
          </div>

          {prs.length > 0 && (
            <div className="pr-milestones">
              <h3 className="pr-milestones-title">&#127942; PR Milestones</h3>
              <div className="pr-milestones-list">
                {prs.map((p, i) => (
                  <div key={p._id} className="pr-milestone-card">
                    <div className="pr-milestone-num">{i + 1}</div>
                    <div className="pr-milestone-info">
                      <span className="pr-milestone-date">{formatDate(p.date)}</span>
                      <div className="pr-milestone-details">
                        <span>{p.weight}kg &times; {p.sets} &times; {p.reps}</span>
                        {p.estimated1RM && <span className="pr-milestone-1rm">1RM: {p.estimated1RM}kg</span>}
                      </div>
                    </div>
                    <div className="pr-milestone-types">
                      {p.prTypes.map((t) => (
                        <span key={t} className="pr-milestone-tag">{t}</span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {workouts.map((w) => {
            const wPR = isWorkoutPR(w._id);
            const wPRTypes = getPRTypes(w._id);
            const w1RM = getEstimated1RM(w._id);
            return (
              <div key={w._id} className={`history-card${wPR ? " pr-card" : ""}`}>
                <div className="history-card-top">
                  <span className="history-date">
                    {formatDate(w.date)}
                    {wPR && <span className="pr-badge-sm" title={`PR: ${wPRTypes.join(", ")}`}>&#127942;</span>}
                  </span>
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
                <div className="history-card-bottom">
                  <span className="history-card-time">{formatTime(w.date)}</span>
                  {wPR && (
                    <span className="pr-types">
                      {wPRTypes.map((t) => (
                        <span key={t} className="pr-type-tag">{t}</span>
                      ))}
                      {w1RM && <span className="pr-est-1rm">Est. 1RM: {w1RM}kg</span>}
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default HistoryPage;
