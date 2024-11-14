import { RequestHandler } from "express";
import { validationResult } from "express-validator";

import ProjectError from "./error";

const validateRequest: RequestHandler = (req, res, next) => {
  //validation

  try {
    const validationError: any = validationResult(req);
    console.error("validationError", validationError);
    if (!validationError.isEmpty()) {
      const err = new ProjectError(
        "Validation failed! " + validationError?.errors[0].msg
      );
      err.statusCode = 422;
      err.data = validationError.array();
      throw err;
    }
    //validation end
    next();
  } catch (error) {
    console.error("error", error);
    next(error);
  }
};

export { validateRequest };
