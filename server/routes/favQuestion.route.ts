import express from "express";
import { 
    addFavQuestion,
    showFavQuestion,
    removeFavQuestion
   } from "../controllers/quizController/favQuestion";
   
import { isAuthenticated } from '../middleware/auth';

const router = express.Router();

//Post /favquestion
router.post("/", isAuthenticated,addFavQuestion );

//Get /favquestion
router.get("/", isAuthenticated,showFavQuestion );

//Post /favquestion:favquestionId
router.delete("/:favquestionId", isAuthenticated,removeFavQuestion );

export default router;