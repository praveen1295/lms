import { RequestHandler } from "express";
import { Mongoose } from "mongoose";

import ProjectError from "../../helper/error";
import Quiz from "../../models/quiz";
import Report from "../../models/report";
import apiResponse from "../../utils/apiResponse";

const startExam: RequestHandler = async (req, res, next) => {
  const userId = req?.user?._id;
  try {
    const quizId = req.params.quizId;
    const quiz = await Quiz.findById(quizId, {
      name: 1,
      questionList: 1,
      isPublished: 1,
      createdBy: 1,
      category: 1,
      attemptsAllowedPerUser: 1,
      attemptedUsers: 1,
      passingPercentage: 1,
      isPublicQuiz: 1,
      allowedUser: 1,
      duration: 1,
    });

    if (!quiz) {
      const err = new ProjectError("No quiz found!");
      err.statusCode = 404;
      throw err;
    }

    if (!quiz.isPublished) {
      const err = new ProjectError("Quiz is not published!");
      err.statusCode = 405;
      throw err;
    }

    if (quiz.createdBy.toString() === userId) {
      const err = new ProjectError("You can't attend your own quiz!");
      err.statusCode = 405;
      throw err;
    }

    // Uncomment this section if you want to check for user authorization
    // if (!quiz.isPublicQuiz && !quiz.allowedUser.includes(req?.user?._id)) {
    //   const err = new ProjectError("You are not authorized!");
    //   err.statusCode = 403;
    //   throw err;
    // }

    if (quiz.category === "test" && quiz.attemptsAllowedPerUser) {
      const existingUser = quiz.attemptedUsers.find(
        (user) => user.id === userId.toString()
      );

      if (existingUser) {
        if (
          existingUser.attemptsLeft !== undefined &&
          existingUser.attemptsLeft > 0
        ) {
          existingUser.attemptsLeft -= 1;
        } else {
          // const err = new ProjectError("You have zero attempts left!");
          // err.statusCode = 405;
          // throw err;
        }
      } else {
        // If user hasn't attempted before, add them with initial attempts
        const newUser = {
          id: userId.toString(),
          attemptsLeft: quiz.attemptsAllowedPerUser - 1,
        };
        quiz.attemptedUsers.push(newUser);
      }

      // Save the updated quiz document
      await quiz.save();
    }

    // Randomize the question order
    quiz.questionList = quiz.questionList.sort(() => Math.random() - 0.5);

    // Return the quiz details
    apiResponse.success(res, quiz, "Quiz");
  } catch (error) {
    next(error);
  }
};

const submitExam: RequestHandler = async (req, res, next) => {
  try {
    const userId = req?.user?._id;
    const quizId = req.body.quizId;
    const attemptedQuestion = req.body.attemptedQuestion;
    console.log("attemptedQuestion", userId, quizId, attemptedQuestion);
    const quiz = await Quiz.findById(quizId, {
      questionList: 1,
      answers: 1,
      passingPercentage: 1,
    });
    if (!quiz) {
      const err = new ProjectError("No quiz found!");
      err.statusCode = 404;
      throw err;
    }

    // if (quiz?.createdBy.toString() === userId) {
    //   const err = new ProjectError("You can't submit your own quiz!");
    //   err.statusCode = 405;
    //   throw err;
    // }

    const answers = quiz.answers;
    const passingPercentage = quiz.passingPercentage;
    const allQuestions = Object.keys(answers);
    const total = allQuestions.length;

    let score = 0;
    let attemptedAnswerWithRightAnswer = [];

    for (let i = 0; i < total; i++) {
      let questionNumber = allQuestions[i];
      const attemptedAnswer = attemptedQuestion[questionNumber];
      const rightAnswer = answers[questionNumber];
      if (!!attemptedAnswer) {
        attemptedAnswerWithRightAnswer.push({
          questionNumber,
          attemptedAnswer,
          rightAnswer,
        });
      }

      if (
        !!attemptedQuestion[questionNumber] &&
        answers[questionNumber] == attemptedQuestion[questionNumber]
      ) {
        score = score + 1;
      }
    }

    let result = "";
    let percentage = 0;
    percentage = (score / total) * 100;

    if (percentage >= passingPercentage) {
      result += "Pass";
    } else {
      result += "Fail";
    }

    const report = new Report({
      userId,
      quizId,
      score,
      total,
      percentage,
      result,
      attemtedAnswers: attemptedAnswerWithRightAnswer,
    });
    const data = await report.save();

    apiResponse.success(
      res,
      {
        total,
        score,
        result,
        reportId: data._id,
        attemptedAnswerWithRightAnswer,
      },
      "Quiz submitted"
    );
  } catch (error) {
    next(error);
  }
};

const doesQuizExist = async (quizId: Mongoose["Types"]["ObjectId"]) => {
  const quiz = await Quiz.findById(quizId);
  if (!quiz) return false;
  return true;
};

const isValidAttempt = async (
  attemptedQuestion: {},
  quizId: Mongoose["Types"]["ObjectId"]
) => {
  const quiz = await Quiz.findById(quizId);

  if (!quiz) {
    const err = new ProjectError("No quiz found!");
    err.statusCode = 404;
    throw err;
  }
  const answers = quiz.answers;
  const questions = Object.keys(answers);
  const attemptQ = Object.keys(attemptedQuestion);

  // if (attemptQ.length != questions.length) return false;
  let flag = 0;
  attemptQ.forEach((e) => {
    if (questions.indexOf(e) < 0) {
      flag = 1;
    }
  });
  if (flag) {
    return false;
  }
  return true;
};

export { doesQuizExist, isValidAttempt, startExam, submitExam };
