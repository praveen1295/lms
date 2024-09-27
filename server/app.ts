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

// import authRoute from "./routes/auth";
import examRoute from "./routes/exam.route";
import quizRoute from "./routes/quiz.route";
import reportRoute from "./routes/report.route";
// import userRoute from "./routes/user";
import favQuestionRoute from "./routes/favQuestion.route";
// import ProjectError from "./helper/error";
import { ReturnResponse } from "./utils/interfaces";
import clearBlacklistedTokenScheduler from "./utils/clearBlacklistedTokenScheduler";

import { rateLimit } from "express-rate-limit";

// body parser
app.use(express.json({ limit: "50mb" }));

// cookie parser
app.use(cookieParser());

// cors => cross origin resource sharing
// app.use(cors());

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
    // allowedHeaders: "Content-Type,Authorization",
    exposedHeaders: ["X-Total-Count"],
  })
);

// api requests limit
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: "draft-7",
  legacyHeaders: false,
});

// Group API version 1 routes together
app.use("/api/v1", [
  userRouter,
  orderRouter,
  courseRouter,
  notificationRouter,
  analyticsRouter,
  layoutRouter,
]);

// Group exam-related routes together
app.use("/api/v1/exam", examRoute);
app.use("/api/v1/quiz", quizRoute);
app.use("/api/v1/report", reportRoute);
app.use("/api/v1/favquestion", favQuestionRoute);

// Health check route
app.get("/health", (req: Request, res: Response) => {
  res.status(200).send("Server is working!");
});

// testing api
app.get("/test", (req: Request, res: Response, next: NextFunction) => {
  res.status(200).json({
    succcess: true,
    message: "API is working",
  });
});

// unknown route
app.all("*", (req: Request, res: Response, next: NextFunction) => {
  const err = new Error(`Route ${req.originalUrl} not found`) as any;
  err.statusCode = 404;
  next(err);
});

// middleware calls
app.use(limiter);
app.use(ErrorMiddleware);
