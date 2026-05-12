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

const calc1RM = (weight, reps) => weight * (1 + reps / 30);
const calcVolume = (sets, reps, weight) => sets * reps * weight;

const detectPRs = async (exercise, sets, reps, weight) => {
  const past = await Workout.find({
    exercise: { $regex: new RegExp(`^${exercise}$`, "i") }
  });
  if (past.length === 0) return ["1RM", "Volume", "Weight"];

  const new1RM = calc1RM(weight, reps);
  const newVolume = calcVolume(sets, reps, weight);
  const prs = [];

  const best1RM = Math.max(...past.map(w => calc1RM(w.weight, w.reps)));
  if (new1RM > best1RM) prs.push("1RM");

  const bestVolume = Math.max(...past.map(w => calcVolume(w.sets, w.reps, w.weight)));
  if (newVolume > bestVolume) prs.push("Volume");

  const bestWeight = Math.max(...past.map(w => w.weight));
  if (weight > bestWeight) prs.push("Weight");

  return prs;
};

const getPRWorkouts = async (exercise) => {
  const all = await Workout.find({
    exercise: { $regex: new RegExp(`^${exercise}$`, "i") }
  }).sort({ date: 1 });

  const prs = [];
  let best1RM = 0, bestVolume = 0, bestWeight = 0;

  for (const w of all) {
    const e1RM = calc1RM(w.weight, w.reps);
    const eVol = calcVolume(w.sets, w.reps, w.weight);
    const milestones = [];

    if (e1RM > best1RM) { best1RM = e1RM; milestones.push("1RM"); }
    if (eVol > bestVolume) { bestVolume = eVol; milestones.push("Volume"); }
    if (w.weight > bestWeight) { bestWeight = w.weight; milestones.push("Weight"); }

    if (milestones.length > 0) {
      prs.push({ ...w.toObject(), prTypes: milestones, estimated1RM: Math.round(e1RM * 10) / 10 });
    }
  }

  return prs;
};

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

    const newWorkout = new Workout({ exercise, sets, reps, weight });
    await newWorkout.save();
    const prs = await detectPRs(exercise, sets, reps, weight);
    res.status(201).json({ ...newWorkout.toObject(), isPR: prs.length > 0, prTypes: prs });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

// 🏆 GET PR milestones for an exercise
app.get("/workouts/prs/:exercise", async (req, res) => {
  try {
    const prs = await getPRWorkouts(req.params.exercise);
    res.json(prs);
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