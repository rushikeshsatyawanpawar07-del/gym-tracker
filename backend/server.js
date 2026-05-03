const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const app = express();

// Middleware
app.use(cors({ origin: "*" }));
app.use(express.json());

// 🔗 MongoDB Connection (with proper logs)
mongoose.connect(process.env.MONGO_URI)
.then(() => {
  console.log("✅ MongoDB Connected Successfully");
})
.catch((err) => {
  console.error("❌ MongoDB Connection Error:", err.message);
});

// 🏋️ Workout Schema
const workoutSchema = new mongoose.Schema({
  exercise: { type: String, required: true },
  sets: { type: Number, required: true },
  reps: { type: Number, required: true },
  weight: { type: Number, required: true },
  date: { type: Date, default: Date.now },
});

const Workout = mongoose.model("Workout", workoutSchema);

// 🧪 Test route
app.get("/", (req, res) => {
  res.send("Gym Tracker API Running 🚀");
});

// 📥 GET all workouts
app.get("/workouts", async (req, res) => {
  try {
    const workouts = await Workout.find().sort({ date: -1 });
    res.json(workouts);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

// ➕ ADD workout
app.post("/add-workout", async (req, res) => {
  try {
    const { exercise, sets, reps, weight } = req.body;

    if (!exercise || !sets || !reps || !weight) {
      return res.status(400).json({ error: "All fields are required" });
    }

    const newWorkout = new Workout({
      exercise,
      sets,
      reps,
      weight,
    });

    await newWorkout.save();
    res.status(201).json(newWorkout);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

// ❌ DELETE workout
app.delete("/workouts/:id", async (req, res) => {
  try {
    await Workout.findByIdAndDelete(req.params.id);
    res.json({ message: "Workout deleted ✅" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

// 🚀 Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});