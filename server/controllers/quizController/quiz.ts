//model
import { RequestHandler } from "express";
import fs from "fs";
import ProjectError from "../../helper/error";
import Quiz from "../../models/quiz";
import userModel from "../../models/user.model";
import { rootDir } from "../../middleware/fileUpload.middleware";
import apiResponse from "../../utils/apiResponse";
console.log("rootDir", rootDir);
const createQuiz = async (req: any, res: any) => {
  try {
    const createdBy = req?.user?._id.toString();

    const {
      name,
      description,
      category,
      difficultyLevel,
      passingPercentage,
      attemptsAllowedPerUser,
      isPublicQuiz,
      allowedUser,
      answers,
      examName,
      isShuffle,
      duration,
      questionList: rawQuestionList,
    } = req.body;

    const questionList =
      typeof rawQuestionList === "string"
        ? JSON.parse(rawQuestionList)
        : rawQuestionList;

    // Attach images to each question in questionList
    const formattedQuestionList = questionList.map(
      (question: any, index: number) => {
        const newQuestionImagesFiles =
          req?.files[`questionList[${index}][newQuestionImages]`] || [];
        console.log("newQuestionImagesFiles", newQuestionImagesFiles);

        const questionImages = newQuestionImagesFiles.map(
          (file: any) =>
            `${process.env.BACKEND_URL}/api/v1/static/QUESTION_IMG/${file.filename}`
        );

        return { ...question, questionImages };
      }
    );

    // Create and save the quiz
    const quiz = new Quiz({
      name,
      description,
      category,
      difficultyLevel,
      questionList: formattedQuestionList,
      passingPercentage,
      attemptsAllowedPerUser,
      isPublicQuiz: isPublicQuiz === "true" ? true : false,
      allowedUser,
      createdBy,
      answers: typeof answers === "string" ? JSON.parse(answers) : answers,
      examName,
      isShuffle: isShuffle === "true" ? true : false,
      duration: Number(duration),
    });

    const result = await quiz.save();

    apiResponse.success(
      res,
      { quizId: result._id },
      "Quiz created successfully"
    );
  } catch (error: any) {
    console.error("Error creating quiz:", error);
    apiResponse.error(res, "Quiz creation failed", 500);
  }
};

const getQuizById: RequestHandler = async (req, res, next) => {
  try {
    const quizId = req.params.quizId;
    console.log("quizId", quizId);
    let quiz;
    if (quizId) {
      quiz = await Quiz.findById(
        quizId
        //    {
        //   name: 1,
        //   category: 1,
        //   questionList: 1,
        //   answers: 1,
        //   createdBy: 1,
        //   passingPercentage: 1,
        //   isPublicQuiz: 1,
        //   allowedUser: 1,
        // }
      );

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

    apiResponse.success(res, quiz, "Quiz");
  } catch (error) {
    next(error);
  }
};

const updateQuiz: RequestHandler = async (req: any, res, next) => {
  try {
    const quizId = req.body._id;

    console.log("req.body", req.body);

    const quiz = await Quiz.findById(quizId);

    if (!quiz) {
      const err = new ProjectError("Quiz not found!");
      err.statusCode = 404;
      throw err;
    }

    // if (req?.user?._id.toString() !== quiz.createdBy.toString()) {
    //   const err = new ProjectError("You are not authorized!");
    //   err.statusCode = 403;
    //   throw err;
    // }

    if (quiz.isPublished) {
      const err = new ProjectError("You cannot update a published Quiz!");
      err.statusCode = 405;
      throw err;
    }

    // Check for unique quiz name if it is being changed
    if (req.body.name && quiz.name !== req.body.name) {
      const status = await isValidQuizName(req.body.name);
      if (!status) {
        const err = new ProjectError("Please enter a unique quiz name.");
        err.statusCode = 422;
        throw err;
      }
      quiz.name = req.body.name;
    }

    // Update fields if they are present in the request
    if (req.body.description) {
      quiz.description = req.body.description;
    }

    if (req.body.category) {
      quiz.category = req.body.category;
    }

    if (req.body.examName) {
      quiz.examName = req.body.examName;
    }

    if (req.body.duration !== undefined) {
      quiz.duration = req.body.duration;
    }

    if (req.body.isShuffle !== undefined) {
      quiz.isShuffle = req.body.isShuffle;
    }

    if (req.body.difficultyLevel) {
      quiz.difficultyLevel = req.body.difficultyLevel;
    }

    if (req.body.answers) {
      quiz.answers =
        typeof req.body.answers === "string"
          ? JSON.parse(req.body.answers)
          : req.body.answers;
    }

    if (req.body.passingPercentage !== undefined) {
      quiz.passingPercentage = req.body.passingPercentage;
    }

    if (req.body.isPublicQuiz !== undefined) {
      quiz.isPublicQuiz = req.body.isPublicQuiz;
    }

    if (req.body.allowedUser) {
      quiz.allowedUser = req.body.allowedUser;
    }

    if (req.body.isPaid !== undefined) {
      quiz.isPaid = req.body.isPaid;
    }

    if (req.body.isDemo !== undefined) {
      quiz.isDemo = req.body.isDemo;
    }

    if (req.body.attemptsAllowedPerUser !== undefined) {
      quiz.attemptsAllowedPerUser = req.body.attemptsAllowedPerUser;
    }

    // Parse and update questionList if provided
    if (req.body.questionList) {
      const updatedQuestionList =
        typeof req.body.questionList === "string"
          ? JSON.parse(req.body.questionList)
          : req.body.questionList;

      const formattedQuestionList = updatedQuestionList.map(
        (question: any, index: number) => {
          const oldQuestionImages = question.oldQuestionImages || [];

          console.log("oldQuestionImages", oldQuestionImages);

          const deleteQuestionImages = quiz.questionList
            .filter(
              (item) => item._id.toString() === question._id.toString()
            )[0]
            .questionImages.filter(
              (image) => !oldQuestionImages.includes(image)
            );

          console.log("deleteQuestionImages", deleteQuestionImages);

          const newQuestionImagesFiles =
            req?.files[`questionList[${index}][newQuestionImages]`] || [];

          // If new images are provided, delete the old images
          if (deleteQuestionImages.length > 0 && question.questionImages) {
            deleteQuestionImages.forEach((imageUrl: string) => {
              const filePath = imageUrl.replace(
                `${process.env.BACKEND_URL}/api/v1/static/QUESTION_IMG/`,
                ""
              );
              const fullFilePath = `${rootDir}/QUESTION_IMG/${filePath}`;

              fs.unlink(fullFilePath, (err: any) => {
                if (err) {
                  console.error(`Error deleting file: ${filePath}`, err);
                } else {
                  console.log(`Deleted old image file: ${filePath}`);
                }
              });
            });
          }

          // Map new images
          const questionImages = newQuestionImagesFiles.map(
            (file: any) =>
              `${process.env.BACKEND_URL}/api/v1/static/QUESTION_IMG/${file.filename}`
          );

          // Use new images if available, otherwise keep existing images
          const updatedImages = questionImages.length
            ? questionImages
            : question.questionImages || [];

          console.log("updatedImages", updatedImages);

          return {
            ...question,
            questionImages: [...updatedImages, ...oldQuestionImages],
          };
        }
      );

      quiz.questionList = formattedQuestionList;
    }

    // Save updated quiz
    await quiz.save();

    apiResponse.success(res, {}, "Quiz updated successfully");
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

    // if (req?.user?._id.toString() !== quiz.createdBy.toString()) {
    //   const err = new ProjectError("You are not authorized!");
    //   err.statusCode = 403;
    //   throw err;
    // }

    if (quiz.isPublished) {
      const err = new ProjectError("You cannot delete, published Quiz!");
      err.statusCode = 405;
      throw err;
    }

    await Quiz.deleteOne({ _id: quizId });

    apiResponse.success(res, {}, "Quiz deleted successfully");
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
    // if (req?.user?._id.toString() !== quiz.createdBy.toString()) {
    //   const err = new ProjectError("You are not authorized!");
    //   err.statusCode = 403;
    //   throw err;
    // }

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
    apiResponse.success(res, {}, "Quiz published!");
  } catch (error) {
    next(error);
  }
};

const isValidQuiz = async (
  questionList: {
    questionNumber: string;
    question: string;
    options: Record<string, string>;
    newQuestionImages: any;
  }[],
  answers: Record<string, string>
) => {
  // Check if questionList is non-empty
  console.log("answers", answers);
  console.log("questionList", questionList);

  if (!questionList.length) {
    console.log("Validation failed: questionList is empty.");
    return false;
  }

  // Ensure each question has a corresponding answer
  if (questionList.length !== Object.keys(answers).length) {
    console.log(
      "Validation failed: Number of questions and answers do not match."
    );
    return false;
  }

  // Validate each question and its corresponding answer
  let isValid = true;
  questionList.forEach((question) => {
    const answerKey = question.questionNumber.toString(); // Ensure consistent key format
    const answerValue = answers[answerKey];

    // Check if the answer exists in the options
    if (!answerValue || !question.options[answerValue]) {
      console.log(
        `Validation failed: No matching option for answer "${answerValue}" in question ${question.questionNumber}`
      );
      isValid = false;
    }
  });

  return isValid;
};

// const isValidQuiz = async (
//   questionList: [{ questionNumber: Number; question: String; options: {} }],
//   answers: {}
// ) => {
//   if (!questionList.length) {
//     return false;
//   }
//   if (questionList.length != Object.keys(answers).length) {
//     return false;
//   }
//   let flag = true;
//   questionList.forEach(
//     (question: { questionNumber: Number; question: String; options: {} }) => {
//       let opt = Object.keys(question["options"]);
//       if (
//         opt.indexOf(
//           `${
//             Object.values(answers)[
//               Object.keys(answers).indexOf(question.questionNumber.toString())
//             ]
//           }`
//         ) == -1
//       ) {
//         flag = false;
//       }
//     }
//   );
//   return flag;
// };

const isValidQuizName = async (name: String) => {
  const quiz = await Quiz.findOne({ name });
  if (!quiz) {
    return true;
  }
  return false;
};

const getAllQuiz: RequestHandler = async (req, res, next) => {
  try {
    const { filterType, quizType } = req.query; // expecting 'paid', 'free', or 'all' from query parameter

    let query: any = {};

    if (quizType === "public") {
      query.isPublic = true;
    }

    if (quizType === "private") {
      query.isPublic = false;
    }

    if (quizType === "published") {
      query.isPublished = true;
    }

    if (quizType === "unPublished") {
      query.isPublished = false;
    }

    let quiz = await Quiz.find(query, {
      name: 1,
      category: 1,
      questionList: 1,
      createdBy: 1,
      passingPercentage: 1,
      isPublicQuiz: 1,
      allowedUser: 1,
      isPaid: 1,
      isPublished: 1,
      examName: 1,
      difficultyLevel: 1,
    });

    // Filter quizzes created by user itself
    // quiz = quiz.filter((item) => {
    //   return (
    //     (item.isPublicQuiz ||
    //       item.allowedUser.includes(req?.user?._id.toString())) &&
    //     item.createdBy.toString() !== req?.user?._id.toString()
    //   );
    // });

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

    apiResponse.success(res, quiz, "All Published Quiz");
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

    apiResponse.success(res, quiz, "All Exam Quizzes");
  } catch (error) {
    next(error);
  }
};

const getAllQuizTest: RequestHandler = async (req, res, next) => {
  try {
    const { filterType, examName, isDemo } = req.query; // expecting 'paid', 'free', or 'all' from query parameter
    console.log(
      "examName",
      examName,
      "filterType",
      filterType,
      "isDemo",
      isDemo
    );
    let quiz = await Quiz.find(
      {
        isPublished: true,
        examName,
        // , category: "test"
      },
      {
        name: 1,
        category: 1,
        questionList: 1,
        createdBy: 1,
        passingPercentage: 1,
        isPublicQuiz: 1,
        allowedUser: 1,
        isPaid: 1,
        isDemo: 1,
        examName: 1,
        attemptedUsers: 1,
      }
    );

    // Apply additional filter based on query parameter
    if (filterType === "paid") {
      quiz = quiz.filter((item) => item.isPaid === true);
    } else if (filterType === "free") {
      quiz = quiz.filter((item) => item.isPaid === false);
    }
    // If 'all', no additional filtering is needed

    // if (!quiz || quiz.length === 0) {
    //   const err = new ProjectError("No test quiz found!");
    //   err.statusCode = 404;
    //   throw err;
    // }

    apiResponse.success(res, quiz, "All Test Quizzes");
  } catch (error) {
    next(error);
  }
};

export {
  createQuiz,
  deleteQuiz,
  getQuizById,
  isValidQuiz,
  isValidQuizName,
  publishQuiz,
  updateQuiz,
  getAllQuiz,
  getAllQuizExam,
  getAllQuizTest,
};
