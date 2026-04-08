import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import philosophersRouter from "./routes/philosophers.js";
import responseRouter from "./routes/response.js";
import healthRouter from "./routes/health.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

function normalizeOrigin(origin) {
  return origin?.trim().replace(/\/$/, "");
}

const rawAllowedOrigins =
  process.env.FRONTEND_URLS || process.env.FRONTEND_URL || "http://localhost:5173";

const allowedOrigins = rawAllowedOrigins
  .split(",")
  .map((origin) => normalizeOrigin(origin))
  .filter(Boolean);

// Middleware
app.use(express.json());
app.use(
  cors({
    origin: (origin, callback) => {
      // Allow non-browser and same-origin requests that may not send Origin.
      if (!origin) return callback(null, true);

      const normalizedOrigin = normalizeOrigin(origin);
      if (allowedOrigins.includes(normalizedOrigin)) {
        return callback(null, true);
      }

      return callback(new Error(`CORS blocked for origin: ${origin}`));
    },
    credentials: true
  })
);

// Routes
app.use("/api/philosophers", philosophersRouter);
app.use("/api/response", responseRouter);
app.use("/api/health", healthRouter);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error("Error:", err);
  res.status(err.status || 500).json({
    error: err.message || "Internal Server Error",
    code: err.code || "server_error"
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: "Route not found" });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV}`);
  console.log(`Allowed CORS origins: ${allowedOrigins.join(", ")}`);
});
