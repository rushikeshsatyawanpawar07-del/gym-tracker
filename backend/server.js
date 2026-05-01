const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const app = express();

app.use(cors());
app.use(express.json());

// MongoDB connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected"))
  .catch(err => console.log(err));

// Workout Schema
const workoutSchema = new mongoose.Schema({
  exercise: { type: String, required: true },
  sets: { type: Number, required: true },
  reps: { type: Number, required: true },
  weight: { type: Number, required: true },
  date: { type: Date, default: Date.now }
});

const Workout = mongoose.model("Workout", workoutSchema);

// Test route
app.get("/", (req, res) => {
  res.send("Gym Tracker API Running");
});

// Get all workouts
app.get("/workouts", async (req, res) => {
  try {
    const workouts = await Workout.find().sort({ date: -1 });
    res.json(workouts);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Add workout
app.post("/add-workout", async (req, res) => {
  try {
    const { exercise, sets, reps, weight, date } = req.body;
    const newWorkout = new Workout({ exercise, sets, reps, weight, date });
    await newWorkout.save();
    res.status(201).json(newWorkout);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Delete workout
app.delete("/workouts/:id", async (req, res) => {
  try {
    await Workout.findByIdAndDelete(req.params.id);
    res.json({ message: "Workout deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
