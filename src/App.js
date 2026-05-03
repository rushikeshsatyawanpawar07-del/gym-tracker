import { Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import ExercisesPage from "./pages/ExercisesPage";
import WorkoutLogPage from "./pages/WorkoutLogPage";
import "./App.css";

function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/exercises/:muscleId" element={<ExercisesPage />} />
      <Route path="/log/:muscleId/:exerciseName" element={<WorkoutLogPage />} />
    </Routes>
  );
}

export default App;
