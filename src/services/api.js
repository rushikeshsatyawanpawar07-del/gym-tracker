export const getWorkouts = async (userId) => {
  const res = await fetch(`/api/workouts?userId=${encodeURIComponent(userId)}`);
  if (!res.ok) throw new Error("Failed to fetch workouts");
  return res.json();
};

export const addWorkout = async (workoutData) => {
  const res = await fetch("/api/add-workout", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(workoutData),
  });
  if (!res.ok) throw new Error("Failed to add workout");
  return res.json();
};

export const deleteWorkout = async (id, userId) => {
  const res = await fetch(`/api/workouts/${id}?userId=${encodeURIComponent(userId)}`, {
    method: "DELETE",
  });
  if (!res.ok) throw new Error("Failed to delete workout");
  return res.json();
};

export const getPRs = async (exerciseName, userId) => {
  const res = await fetch(`/api/workouts/prs/${encodeURIComponent(exerciseName)}?userId=${encodeURIComponent(userId)}`);
  if (!res.ok) throw new Error("Failed to fetch PRs");
  return res.json();
};
