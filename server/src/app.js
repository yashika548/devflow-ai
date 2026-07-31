const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");

const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");

const aiRoutes = require("./routes/aiRoutes");
const chatRoutes = require("./routes/chatRoutes");

const app = express();

// Middleware


app.use(
  cors({
    origin: [
      "http://localhost:3000",
      "https://devflow-ai-z1mc.vercel.app",
      "https://devflow-ai-z1mc-aocdero8a-yashika11.vercel.app",
    ],
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);
app.use(express.json());
app.use(cookieParser());
app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);
app.use("/api/ai", aiRoutes);
app.use("/api/chat", chatRoutes);

// Test Route
app.get("/", (req, res) => {
    res.send("🚀 DevFlow AI Backend is Running...");
});

module.exports = app;