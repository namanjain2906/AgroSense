import cors from "cors";
import mongoSanitize from "express-mongo-sanitize";
import rateLimit from "express-rate-limit";
import helmet from "helmet";

const parseAllowedOrigins = () => {
  const productionOrigins = process.env.FRONTEND_URL
    ? process.env.FRONTEND_URL.split(",").map((origin) => origin.trim())
    : [];

  return [
    "http://localhost:3000",
    "http://localhost:5173",
    "http://127.0.0.1:3000",
    "http://127.0.0.1:5173",
    // Common deploy origins (add your deployed frontend here)
    "https://agrosense-delta.vercel.app",
    // Render backend origin (in case frontend or requests originate from here)
    "https://agrosense-x0kh.onrender.com",
    ...productionOrigins,
  ].filter(Boolean);
};

const allowedOrigins = parseAllowedOrigins();

export const corsOptions = {
  credentials: true,
  origin(origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      return callback(null, true);
    }

    return callback(new Error(`CORS blocked origin: ${origin}`));
  },
};

export const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 100,
  standardHeaders: "draft-8",
  legacyHeaders: false,
  message: {
    message: "Too many requests from this IP, please try again later.",
  },
});

export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 5,
  standardHeaders: "draft-8",
  legacyHeaders: false,
  skipSuccessfulRequests: true,
  message: {
    message: "Too many authentication attempts, please try again later.",
  },
});

export const applySecurityMiddleware = (app) => {
  app.use(helmet());
  // Attach CORS middleware and explicitly handle preflight OPTIONS requests
  app.use(cors(corsOptions));
  app.options("*", cors(corsOptions));

  // Log allowed origins for debugging (prints on server start)
  try {
    // eslint-disable-next-line no-console
    console.log("CORS allowed origins:", allowedOrigins);
  } catch (e) {
    // ignore logging errors
  }
  app.use(globalLimiter);

  // Must run after parsers so req.body, req.query, and req.params exist.
  app.use(
    mongoSanitize({
      replaceWith: "_",
    }),
  );
};
