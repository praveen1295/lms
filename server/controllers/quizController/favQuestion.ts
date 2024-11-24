import { RequestHandler } from "express";
import { ReturnResponse } from "../../utils/interfaces";

import userModel from "../../models/user.model";
import favQuestion from "../../models/favQuestion";
import ProjectError from "../../helper/error";

const addFavQuestion: RequestHandler = async (req, res, next) => {
  let resp: ReturnResponse;
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
    resp = {
      success: true,
      message: "Question added to Favourites!",
      data: {},
    };
    res.status(200).send(resp);
  } catch (error) {
    next(error);
  }
};

const showFavQuestion: RequestHandler = async (req, res, next) => {
  const userId = req?.user?._id;
  let resp: ReturnResponse;
  try {
    const favQues = await favQuestion.find({ userId });
    resp = {
      success: true,
      message: "Favourite Questions!",
      data: { favQues },
    };
    res.status(200).send(resp);
  } catch (error) {
    next(error);
  }
};

//user will get favourites only when he is authenticated,and once he get the id from fav collection he can delete it.

const removeFavQuestion: RequestHandler = async (req, res, next) => {
  const questionId = req.params.favquestionId;
  try {
    await favQuestion.deleteOne({ _id: questionId });
    const resp: ReturnResponse = {
      success: true,
      message: "Question removed from favourites successfully",
      data: {},
    };
    res.status(200).send(resp);
  } catch (error) {
    next(error);
  }
};

export { addFavQuestion, showFavQuestion, removeFavQuestion };
