import { RequestHandler } from "express";

import userModel from "../../models/user.model";
import favQuestion from "../../models/favQuestion";
import ProjectError from "../../helper/error";
import apiResponse from "../../utils/apiResponse";

const addFavQuestion: RequestHandler = async (req, res, next) => {
  const userId = req?.user?._id;
  const options = req.body.options;
  const question = req.body.question;

  try {
    const user = await userModel.findById(userId);
    if (!user) {
      const err = new ProjectError("userModel does not exist");
      err.statusCode = 401;
      throw err;
    }

    const favQues = new favQuestion({ question, options, userId });
    await favQues.save();

    apiResponse.success(res, {}, "Question added to Favorites!");
  } catch (error) {
    next(error);
  }
};

const showFavQuestion: RequestHandler = async (req, res, next) => {
  const userId = req?.user?._id;
  try {
    const favQues = await favQuestion.find({ userId });

    apiResponse.success(res, { favQues }, "Favourite Questions!");
  } catch (error) {
    next(error);
  }
};

//user will get favourites only when he is authenticated,and once he get the id from fav collection he can delete it.

const removeFavQuestion: RequestHandler = async (req, res, next) => {
  const questionId = req.params.favquestionId;
  try {
    await favQuestion.deleteOne({ _id: questionId });
    apiResponse.success(
      res,
      {},
      "Question removed from favourites successfully"
    );
  } catch (error) {
    next(error);
  }
};

export { addFavQuestion, showFavQuestion, removeFavQuestion };
