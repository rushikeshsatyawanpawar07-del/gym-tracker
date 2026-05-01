const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";

export const getWorkouts = async () => {
  const res = await fetch(`${API_URL}/workouts`);
  if (!res.ok) throw new Error("Failed to fetch workouts");
  return res.json();
};

export const addWorkout = async (workoutData) => {
  const res = await fetch(`${API_URL}/add-workout`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(workoutData),
  });
  if (!res.ok) throw new Error("Failed to add workout");
  return res.json();
};

export const deleteWorkout = async (id) => {
  const res = await fetch(`${API_URL}/workouts/${id}`, {
    method: "DELETE",
  });
  if (!res.ok) throw new Error("Failed to delete workout");
  return res.json();
};
