import { Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import Login from "./pages/Login";
import HomePage from "./pages/HomePage";
import ExercisesPage from "./pages/ExercisesPage";
import WorkoutLogPage from "./pages/WorkoutLogPage";
import HistoryPage from "./pages/HistoryPage";
import "./App.css";

function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<ProtectedRoute><HomePage /></ProtectedRoute>} />
        <Route path="/exercises/:muscleId" element={<ProtectedRoute><ExercisesPage /></ProtectedRoute>} />
        <Route path="/log/:muscleId/:exerciseName" element={<ProtectedRoute><WorkoutLogPage /></ProtectedRoute>} />
        <Route path="/history/:muscleId/:exerciseName" element={<ProtectedRoute><HistoryPage /></ProtectedRoute>} />
      </Routes>
    </AuthProvider>
  );
}

export default App;
