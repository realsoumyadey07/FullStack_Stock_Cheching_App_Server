import dotenv from "dotenv";
dotenv.config();
import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import userRouter from "./routes/user.js";
import savedRouter from "./routes/saved.js";
import cookieParser from "cookie-parser";

const dbUrl = process.env.MONGODB_URL;
const app = express();

// CORS setup
app.use(cors({
  origin: true,
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
  credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Test route
app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Server is running ✅",
  });
});

// API routes
app.use("/api/user", userRouter);
app.use("/api/saved", savedRouter);

// DB connection (only for cold start)
mongoose
  .connect(dbUrl)
  .then(() => {
    console.log("MongoDB connected ✅");
  })
  .catch((err) => {
    console.error("MongoDB connection error ❌", err.message);
  });

app.listen(process.env.PORT || 5000, () => {
  console.log(`Server is running on port ${process.env.PORT || 5000} 🚀`);
});
