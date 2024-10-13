//model
import { RequestHandler } from "express";

import ProjectError from "../../helper/error";
import Quiz from "../../models/quiz";
import { ReturnResponse } from "../../utils/interfaces";
import userModel from "../../models/user.model";

const createQuiz: RequestHandler = async (req, res, next) => {
  try {
    const createdBy = req?.user?._id.toString();

    const user: any = await userModel.findById(req.user?._id);

    if (user.role !== "admin") {
      const resp: ReturnResponse = {
        status: "error",
        message: "Quiz not created!",
        data: { message: "Only admin/owner can able to create quiz." },
      };
      return res.status(500).send(resp);
    }

    const name = req.body.name;
    const category = req.body.category;
    const difficultyLevel = req.body.difficultyLevel;
    const questionList = req.body.questionList;
    const answers = req.body.answers;
    const passingPercentage = req.body.passingPercentage;
    const attemptsAllowedPerUser = req.body.attemptsAllowedPerUser;
    const isPublicQuiz = req.body.isPublicQuiz;
    const allowedUser = req.body.allowedUser;
    const quiz = new Quiz({
      name,
      category,
      difficultyLevel,
      questionList,
      answers,
      passingPercentage,
      createdBy,
      attemptsAllowedPerUser,
      isPublicQuiz,
      allowedUser,
    });
    const result = await quiz.save();
    const resp: ReturnResponse = {
      status: "success",
      message: "Quiz created successfully",
      data: { quizId: result._id },
    };
    res.status(201).send(resp);
  } catch (error) {
    next(error);
  }
};

const getQuiz: RequestHandler = async (req, res, next) => {
  try {
    const quizId = req.params.quizId;
    console.log("quizId", quizId);
    let quiz;
    if (quizId) {
      quiz = await Quiz.findById(quizId, {
        name: 1,
        category: 1,
        questionList: 1,
        answers: 1,
        createdBy: 1,
        passingPercentage: 1,
        isPublicQuiz: 1,
        allowedUser: 1,
      });

      if (!quiz) {
        const err = new ProjectError("No quiz found!");
        err.statusCode = 404;
        throw err;
      }
      //   if(!quiz.isPublicQuiz && !quiz.allowedUser.includes(req?.user?._id.toString())){
      //     const err = new ProjectError("You are not authorized!");
      //     err.statusCode = 403;
      //     throw err;
      //   }
      //   if (req?.user?._id.toString() !== quiz.createdBy.toString()) {
      //     const err = new ProjectError("You are not authorized!");
      //     err.statusCode = 403;
      //     throw err;
      //   }
      // } else {
      //   quiz = await Quiz.find({ createdBy: req?.user?._id.toString() });
    }

    if (!quiz) {
      const err = new ProjectError("Quiz not found!");
      err.statusCode = 404;
      throw err;
    }

    const resp: ReturnResponse = {
      status: "success",
      message: "Quiz",
      data: quiz,
    };
    res.status(200).send(resp);
  } catch (error) {
    next(error);
  }
};

const updateQuiz: RequestHandler = async (req, res, next) => {
  try {
    const quizId = req.body._id;
    const quiz = await Quiz.findById(quizId);

    if (!quiz) {
      const err = new ProjectError("Quiz not found!");
      err.statusCode = 404;
      throw err;
    }

    if (req?.user?._id.toString() !== quiz.createdBy.toString()) {
      const err = new ProjectError("You are not authorized!");
      err.statusCode = 403;
      throw err;
    }

    if (quiz.isPublished) {
      const err = new ProjectError("You cannot update, published Quiz!");
      err.statusCode = 405;
      throw err;
    }
    if (quiz.name != req.body.name) {
      let status = await isValidQuizName(req.body.name);
      if (!status) {
        const err = new ProjectError("Please enter an unique quiz name.");
        err.statusCode = 422;
        throw err;
      }
      quiz.name = req.body.name;
    }
    quiz.questionList = req.body.questionList;
    quiz.answers = req.body.answers;
    quiz.passingPercentage = req.body.passingPercentage;
    quiz.isPublicQuiz = req.body.isPublicQuiz;
    quiz.allowedUser = req.body.allowedUser;

    await quiz.save();

    const resp: ReturnResponse = {
      status: "success",
      message: "Quiz updated successfully",
      data: {},
    };
    res.status(200).send(resp);
  } catch (error) {
    next(error);
  }
};

const deleteQuiz: RequestHandler = async (req, res, next) => {
  try {
    const quizId = req.params.quizId;
    const quiz = await Quiz.findById(quizId);

    if (!quiz) {
      const err = new ProjectError("Quiz not found!");
      err.statusCode = 404;
      throw err;
    }

    if (req?.user?._id.toString() !== quiz.createdBy.toString()) {
      const err = new ProjectError("You are not authorized!");
      err.statusCode = 403;
      throw err;
    }

    if (quiz.isPublished) {
      const err = new ProjectError("You cannot delete, published Quiz!");
      err.statusCode = 405;
      throw err;
    }

    await Quiz.deleteOne({ _id: quizId });
    const resp: ReturnResponse = {
      status: "success",
      message: "Quiz deleted successfully",
      data: {},
    };
    res.status(200).send(resp);
  } catch (error) {
    next(error);
  }
};

const publishQuiz: RequestHandler = async (req, res, next) => {
  try {
    const quizId = req.body.quizId;
    const quiz = await Quiz.findById(quizId);

    if (!quiz) {
      const err = new ProjectError("Quiz not found!");
      err.statusCode = 404;
      throw err;
    }
    console.log("first", quiz.createdBy, req?.user?._id.toString());
    if (req?.user?._id.toString() !== quiz.createdBy.toString()) {
      const err = new ProjectError("You are not authorized!");
      err.statusCode = 403;
      throw err;
    }

    if (!!quiz.isPublished) {
      const err = new ProjectError("Quiz is already published!");
      err.statusCode = 405;
      throw err;
    }
    if (quiz.isPublicQuiz === false && quiz.allowedUser.length === 0) {
      const err = new ProjectError("Specify users for private quiz!");
      err.statusCode = 404;
      throw err;
    }

    quiz.isPublished = true;
    await quiz.save();
    const resp: ReturnResponse = {
      status: "success",
      message: "Quiz published!",
      data: {},
    };
    res.status(200).send(resp);
  } catch (error) {
    next(error);
  }
};

const isValidQuiz = async (
  questionList: [{ questionNumber: Number; question: String; options: {} }],
  answers: {}
) => {
  if (!questionList.length) {
    return false;
  }
  if (questionList.length != Object.keys(answers).length) {
    return false;
  }
  let flag = true;
  questionList.forEach(
    (question: { questionNumber: Number; question: String; options: {} }) => {
      let opt = Object.keys(question["options"]);
      if (
        opt.indexOf(
          `${
            Object.values(answers)[
              Object.keys(answers).indexOf(question.questionNumber.toString())
            ]
          }`
        ) == -1
      ) {
        flag = false;
      }
    }
  );
  return flag;
};

const isValidQuizName = async (name: String) => {
  const quiz = await Quiz.findOne({ name });
  if (!quiz) {
    return true;
  }
  return false;
};

const getAllQuiz: RequestHandler = async (req, res, next) => {
  try {
    const { filterType } = req.query; // expecting 'paid', 'free', or 'all' from query parameter

    let quiz = await Quiz.find(
      { isPublished: true },
      {
        name: 1,
        category: 1,
        questionList: 1,
        createdBy: 1,
        passingPercentage: 1,
        isPublicQuiz: 1,
        allowedUser: 1,
        isPaid: 1, // assuming you have an 'isPaid' field for filtering paid/free quizzes
      }
    );

    // Filter quizzes created by user itself
    quiz = quiz.filter((item) => {
      return (
        (item.isPublicQuiz ||
          item.allowedUser.includes(req?.user?._id.toString())) &&
        item.createdBy.toString() !== req?.user?._id.toString()
      );
    });

    // Apply additional filter based on query parameter
    if (filterType === "paid") {
      quiz = quiz.filter((item) => item.isPaid === true);
    } else if (filterType === "free") {
      quiz = quiz.filter((item) => item.isPaid === false);
    }
    // If 'all', no additional filtering is needed

    if (!quiz || quiz.length === 0) {
      const err = new ProjectError("No quiz found!");
      err.statusCode = 404;
      throw err;
    }

    const resp: ReturnResponse = {
      status: "success",
      message: "All Published Quiz",
      data: quiz,
    };
    res.status(200).send(resp);
  } catch (error) {
    next(error);
  }
};

const getAllQuizExam: RequestHandler = async (req, res, next) => {
  try {
    const { filterType, examName } = req.query; // expecting 'paid', 'free', or 'all' from query parameter
    console.log("examName", examName, "filterType", filterType);
    let quiz = await Quiz.find(
      { isPublished: true, category: "exam", examName },
      {
        name: 1,
        category: 1,
        questionList: 1,
        createdBy: 1,
        passingPercentage: 1,
        isPublicQuiz: 1,
        allowedUser: 1,
        isPaid: 1, // assuming you have an 'isPaid' field for filtering paid/free quizzes
      }
    );

    // Filter quizzes created by user itself
    quiz = quiz.filter((item) => {
      return (
        (item.isPublicQuiz ||
          item.allowedUser.includes(req?.user?._id.toString())) &&
        item.createdBy.toString() !== req?.user?._id.toString()
      );
    });

    // Apply additional filter based on query parameter
    if (filterType === "paid") {
      quiz = quiz.filter((item) => item.isPaid === true);
    } else if (filterType === "free") {
      quiz = quiz.filter((item) => item.isPaid === false);
    }
    // If 'all', no additional filtering is needed

    if (!quiz || quiz.length === 0) {
      const err = new ProjectError("No exam quiz found!");
      err.statusCode = 404;
      throw err;
    }

    const resp: ReturnResponse = {
      status: "success",
      message: "All Exam Quizzes",
      data: quiz,
    };
    res.status(200).send(resp);
  } catch (error) {
    next(error);
  }
};

const getAllQuizTest: RequestHandler = async (req, res, next) => {
  try {
    const { filterType, examName } = req.query; // expecting 'paid', 'free', or 'all' from query parameter
    console.log("examName", examName, "filterType", filterType);
    let quiz = await Quiz.find(
      { isPublished: true, category: "test", examName },
      {
        name: 1,
        category: 1,
        questionList: 1,
        createdBy: 1,
        passingPercentage: 1,
        isPublicQuiz: 1,
        allowedUser: 1,
        isPaid: 1, // assuming there's an 'isPaid' field for filtering paid/free quizzes
        isDemo: 1,
        examName: 1,
      }
    );

    // Apply additional filter based on query parameter
    if (filterType === "paid") {
      quiz = quiz.filter((item) => item.isPaid === true);
    } else if (filterType === "free") {
      quiz = quiz.filter((item) => item.isPaid === false);
    }
    // If 'all', no additional filtering is needed

    if (!quiz || quiz.length === 0) {
      const err = new ProjectError("No test quiz found!");
      err.statusCode = 404;
      throw err;
    }

    console.log("quizzzzz======", quiz);

    const resp: ReturnResponse = {
      status: "success",
      message: "All Test Quizzes",
      data: quiz,
    };
    res.status(200).send(resp);
  } catch (error) {
    next(error);
  }
};

export {
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
};
