import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import bodyParser from "body-parser";
import dotenv from "dotenv";
import Guest from "./models/Guest.js";

dotenv.config();
console.log("MONGO_URI:", process.env.MONGO_URI);

const app = express();
app.use(cors()); // Allow frontend requests
app.use(bodyParser.json()); // Parse JSON request body

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(() => console.log("Connected to MongoDB"))
    .catch(err => console.error("MongoDB connection error:", err));

// API to save RSVP data
app.post("/rsvp", async (req, res) => {
    try {
        const newGuest = new Guest(req.body);
        await newGuest.save();
        res.json({ message: "RSVP saved!" });
    } catch (error) {
        res.status(500).json({ error: "Error saving RSVP" });
    }
});

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

app.get("/wake-up", (req, res) => {
    res.send("✅ Backend is awake!");
});