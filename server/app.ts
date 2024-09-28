require("dotenv").config();
import express, { NextFunction, Request, Response } from "express";
export const app = express();
import cors from "cors";
import cookieParser from "cookie-parser";
import { ErrorMiddleware } from "./middleware/error";
import userRouter from "./routes/user.route";
import courseRouter from "./routes/course.route";
import orderRouter from "./routes/order.route";
import notificationRouter from "./routes/notification.route";
import analyticsRouter from "./routes/analytics.route";
import layoutRouter from "./routes/layout.route";

// Routes imports
import examRoute from "./routes/exam.route";
import quizRoute from "./routes/quiz.route";
import reportRoute from "./routes/report.route";
import favQuestionRoute from "./routes/favQuestion.route";

// Utility imports
import { rateLimit } from "express-rate-limit";
import { rootDir, upload } from "./middleware/fileUpload.middleware";
import path from "path";

// Body parser
app.use(express.json({ limit: "50mb" }));

// Cookie parser
app.use(cookieParser());

// CORS setup
const allowedOrigins = [
  "http://localhost:3000",
  "http://localhost:8080",
  "http://localhost:8080/api",
  "http://www.biotronix.com",
  "http://3.111.3.98",
  "http://3.111.3.98/api",
];

app.use(
  cors({
    origin: (origin: any, callback) => {
      if (allowedOrigins.includes(origin) || !origin) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    exposedHeaders: ["X-Total-Count"],
  })
);

// Serve static files
app.use(
  "/api/v1/static/thumbnail",
  express.static(path.join(rootDir, "THUMBNAIL"))
);
app.use(
  "/api/v1/static/pdf_files",
  express.static(path.join(rootDir, "PDF_FILES"))
);

// API request limit setup
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: "draft-7",
  legacyHeaders: false,
});

app.use(limiter);

// Grouped API v1 routes
app.use("/api/v1", [
  userRouter,
  orderRouter,
  courseRouter,
  notificationRouter,
  analyticsRouter,
  layoutRouter,
]);

// Exam-related routes
app.use("/api/v1/exam", examRoute);
app.use("/api/v1/quiz", quizRoute);
app.use("/api/v1/report", reportRoute);
app.use("/api/v1/favquestion", favQuestionRoute);

// Health check route
app.get("/health", (req: Request, res: Response) => {
  res.status(200).send("Server is working!");
});

// Test API
app.get("/test", (req: Request, res: Response, next: NextFunction) => {
  res.status(200).json({
    success: true,
    message: "API is working",
  });
});

// Handle unknown routes
app.all("*", (req: Request, res: Response, next: NextFunction) => {
  const err = new Error(`Route ${req.originalUrl} not found`) as any;
  err.statusCode = 404;
  next(err);
});

// Error handling middleware
app.use(ErrorMiddleware);
