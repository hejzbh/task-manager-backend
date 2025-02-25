import express from "express";
import connectDB from "config/db.js";
import helmet from "helmet";
import cookieParser from "cookie-parser";
import cors from "cors";
import authRouter from "routes/auth.js";
import * as middlewares from "middlewares/index.js";

const PORT = process.env.PORT || 8080;
const app = express();

// Connect DB
connectDB();

// CORS
app.use(
  cors({
    origin: ["http://localhost:3000"],
    credentials: true,
  })
);

// Helmet (More secured)
app.use(helmet());
// Use JSON
app.use(express.json());
// Cookie Parser
app.use(cookieParser());

// Rate limiter
app.use(middlewares.rateLimiter);

// Routes
app.use("/api/v1/auth", authRouter);

// Not found (Not existing routes)
app.use(middlewares.notFound);

// Handle errors
app.use(middlewares.handleError);

app.listen(PORT, () => console.log(`Server is running on PORT: ${PORT}`));
