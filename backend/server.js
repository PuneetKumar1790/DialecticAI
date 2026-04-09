import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import rateLimit from "express-rate-limit";
import philosophersRouter from "./routes/philosophers.js";
import responseRouter from "./routes/response.js";
import healthRouter from "./routes/health.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Needed for accurate client IPs behind Render/Vercel proxies.
app.set("trust proxy", 1);

function normalizeOrigin(origin) {
  return origin?.trim().replace(/\/$/, "");
}

const rawAllowedOrigins =
  process.env.FRONTEND_URLS ||
  process.env.FRONTEND_URL ||
  "http://localhost:5173,https://dialectic-ai.vercel.app,https://dialecticai.puneetk.dev";

const requiredOrigins = [
  "http://localhost:5173",
  "https://dialectic-ai.vercel.app",
  "https://dialecticai.puneetk.dev"
];

const allowedOrigins = [
  ...rawAllowedOrigins.split(","),
  ...requiredOrigins
]
  .map((origin) => normalizeOrigin(origin))
  .filter(Boolean);

const uniqueAllowedOrigins = [...new Set(allowedOrigins)];

// Allow official deployment + Vercel preview URLs for this project.
const vercelOriginPattern = /^https:\/\/dialectic-ai.*\.vercel\.app$/i;

function isAllowedOrigin(origin) {
  const normalizedOrigin = normalizeOrigin(origin);
  if (!normalizedOrigin) return true;
  if (uniqueAllowedOrigins.includes(normalizedOrigin)) return true;
  return vercelOriginPattern.test(normalizedOrigin);
}

const corsOptions = {
  origin: (origin, callback) => {
    // Allow non-browser and same-origin requests that may not send Origin.
    if (!origin) return callback(null, true);

    if (isAllowedOrigin(origin)) {
      return callback(null, true);
    }

    return callback(new Error(`CORS blocked for origin: ${origin}`));
  },
  credentials: true
};

const responseRateLimit = rateLimit({
  windowMs: Number(process.env.RESPONSE_RATE_WINDOW_MS || 10 * 60 * 1000),
  max: Number(process.env.RESPONSE_RATE_MAX || 60),
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    error: "Too many requests. Please wait before asking again.",
    code: "too_many_requests"
  }
});

// Middleware
app.use(express.json());
app.use(cors(corsOptions));
app.options("*", cors(corsOptions));

// Routes
app.use("/api/philosophers", philosophersRouter);
app.use("/api/response", responseRateLimit, responseRouter);
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
  console.log(`Allowed CORS origins: ${uniqueAllowedOrigins.join(", ")}`);
});
