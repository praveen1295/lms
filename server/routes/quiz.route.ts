import express from "express";
import { body } from "express-validator";

import {
  createQuiz,
  deleteQuiz,
  getQuiz,
  isValidQuiz,
  isValidQuizName,
  publishQuiz,
  updateQuiz,
  getAllQuiz,
  getAllQuizExam,
  getAllQuizTest,
} from "../controllers/quizController/quiz";
import { validateRequest } from "../helper/validateRequest";
import { isAuthenticated } from "../middleware/auth";
import { cpUpload } from "../middleware/fileUpload.middleware";
// import { upload } from "../middleware/fileUpload.middleware";
// const cpUpload = upload.fields([
//   { name: "questionImg", maxCount: 10 },
//   // { name: "assetsPhoto", maxCount: 10 },
//   // { name: "thumbnail", maxCount: 1 },
//   // { name: "bannerImg", maxCount: 5 },
// ]);
const router = express.Router();

// create
// POST /quiz/
router.post(
  "/",
  isAuthenticated,
  cpUpload,
  [
    body("name")
      .trim()
      .notEmpty()
      .isLength({ min: 4 })
      .withMessage("Please enter a valid name, minimum 10 characters long")
      .custom((name) =>
        isValidQuizName(name).then((status) => {
          if (!status)
            return Promise.reject("Please enter a unique quiz name.");
        })
      ),
    body("category")
      .trim()
      .notEmpty()
      .toLowerCase()
      .isIn(["test", "exam"])
      .withMessage("Category can only be 'test' or 'exam'"),
    body("questionList").custom((questionList, { req }) =>
      isValidQuiz(questionList, JSON.parse(req.body["answers"])).then(
        (status) => {
          if (!status) {
            return Promise.reject(
              "Please enter a valid quiz with at least one question and correct answers."
            );
          }
        }
      )
    ),
    body("passingPercentage")
      .isFloat({ gt: 0 })
      .withMessage("Passing percentage cannot be zero"),
    body("difficultyLevel")
      .isIn(["easy", "medium", "hard"])
      .withMessage("Difficulty level must be easy, medium, or hard"),
  ],
  validateRequest,
  createQuiz
);

//Get  quiz/allpublished quiz
router.get("/allpublishedquiz", getAllQuiz);

//Get  quiz/allpublished quiz/exam
router.get("/allpublishedquiz/exam", isAuthenticated, getAllQuizExam);

//Get  quiz/allpublished quiz/test
router.get("/allpublishedquiz/test", getAllQuizTest);

// get
// GET /quiz/:quizId
router.get("/:quizId", getQuiz);

//

//update
//PUT /quiz
router.put(
  "/",
  isAuthenticated,
  [
    body("name")
      .trim()
      .not()
      .isEmpty()
      .isLength({ min: 10 })
      .withMessage("Please enter a valid name, minimum 10 character long"),
    body("questionList").custom((questionList, { req }) => {
      return isValidQuiz(questionList, req.body["answers"])
        .then((status: Boolean) => {
          if (!status) {
            return Promise.reject(
              "Please enter a valid quiz having atleast one question, and answers with correct option!"
            );
          }
        })
        .catch((err) => {
          return Promise.reject(err);
        });
    }),
    body("passingPercentage").custom((passingPercentage: Number) => {
      if (passingPercentage == 0) {
        return Promise.reject("Passing percentage can not be zero..");
      }
      return true;
    }),
    body("difficultyLevel").custom((difficultyLevel) => {
      if (
        !difficultyLevel ||
        !["easy", "medium", "hard"].includes(difficultyLevel)
      ) {
        return Promise.reject("Difficulty level must be easy, medium and hard");
      }
      return true;
    }),
  ],
  validateRequest,
  updateQuiz
);

//Delete
//DELETE quiz/:quizId
router.delete("/:quizId", isAuthenticated, deleteQuiz);

//Publish
// PATCH quiz/publish
router.patch("/publish", isAuthenticated, publishQuiz);

export default router;
