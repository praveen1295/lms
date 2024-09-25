import express from "express";

import { getReport } from "../controllers/quizController/report";
import { authorizeRoles, isAuthenticated } from "../middleware/auth";


const router = express.Router();

//GET /report/:reportId
router.get("/:reportId?", isAuthenticated, getReport);

export default router;
