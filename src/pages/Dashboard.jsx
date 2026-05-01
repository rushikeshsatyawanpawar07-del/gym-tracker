import React, { useState } from "react";
import Header from "../components/Header";
import WorkoutForm from "../components/WorkoutForm";
import WorkoutList from "../components/WorkoutList";
import "./Dashboard.css";

function Dashboard() {
  const [refreshKey, setRefreshKey] = useState(0);

  const handleWorkoutAdded = () => {
    setRefreshKey((prev) => prev + 1);
  };

  return (
    <div className="dashboard">
      <Header />
      <main className="main-content">
        <div className="container">
          <WorkoutForm onWorkoutAdded={handleWorkoutAdded} />
          <WorkoutList key={refreshKey} refresh={refreshKey > 0} onRefreshDone={() => setRefreshKey(0)} />
        </div>
      </main>
    </div>
  );
}

export default Dashboard;
