import { useState, useEffect } from "react";
import "./App.css";

function App() {
  const [exercise, setExercise] = useState("");
  const [weight, setWeight] = useState("");
  const [timer, setTimer] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [phase, setPhase] = useState("idle"); // idle, delay, running

  const startWorkout = () => {
    if (!exercise || !weight) {
      alert("Enter exercise and weight");
      return;
    }

    setPhase("delay");
    setTimer(20); // 20 sec delay
    setIsRunning(true);
  };

  useEffect(() => {
    let interval;

    if (isRunning && timer > 0) {
      interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
    } else if (timer === 0 && isRunning) {
      if (phase === "delay") {
        setPhase("running");
        setTimer(60); // workout timer
      } else {
        setIsRunning(false);
        setPhase("idle");
        alert("Set complete!");
      }
    }

    return () => clearInterval(interval);
  }, [timer, isRunning, phase]);

  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      <h1>Gym Tracker 💪</h1>

      <input
        type="text"
        placeholder="Exercise"
        value={exercise}
        onChange={(e) => setExercise(e.target.value)}
      />
      <br /><br />

      <input
        type="number"
        placeholder="Weight (kg)"
        value={weight}
        onChange={(e) => setWeight(e.target.value)}
      />
      <br /><br />

      <button onClick={startWorkout}>Start</button>

      <h2>
        {phase === "delay" && `Get Ready: ${timer}s`}
        {phase === "running" && `Time Left: ${timer}s`}
      </h2>
    </div>
  );
}

export default App;
