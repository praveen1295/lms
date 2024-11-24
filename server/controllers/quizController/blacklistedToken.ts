import BlacklistedToken from "../../models/blacklistedToken";
import ProjectError from "../../helper/error";
import { RequestHandler } from "express";
import jwt from "jsonwebtoken";
import apiResponse from "../../utils/apiResponse";

// Function to clear the blacklist
export const clearBlacklist = async () => {
  try {
    const currentDate = Math.floor(Date.now() / 1000);

    const tokens = await BlacklistedToken.deleteMany({
      expiryAt: { $lt: currentDate },
    }).exec();

    if (tokens) {
      console.log("Blacklist Cleared!");
    } else {
      console.log("Something went wrong while clearing blacklist!");
    }
  } catch (err) {
    console.error(err);
  }
};

// Check if the token is in the Blacklist
export const blacklistedTokenCheck = async (token: any) => {
  const blacklistItem = await BlacklistedToken.findOne({ token });

  if (blacklistItem) {
    const err = new ProjectError("Not authenticated!");
    err.statusCode = 403;
    throw err;
  }
};

// Log Out Function
export const logOut: RequestHandler = async (req, res, next) => {
  try {
    const authHeader = req.get("Authorization");

    if (!authHeader) {
      return apiResponse.error(
        res,
        {},
        "Authorization header is missing!",
        424
      );
    }

    const token = authHeader.split(" ")[1];
    const secretKey = process.env.SECRET_KEY || "";

    let decodedToken;
    try {
      decodedToken = jwt.verify(token, secretKey) as {
        userId: string;
        iat: number;
        exp: number;
      };
    } catch (err) {
      return apiResponse.error(res, {}, "Invalid or expired token!", 401);
    }

    const expiryAt = decodedToken.exp;

    const blacklistedToken = new BlacklistedToken({ token, expiryAt });
    const result = await blacklistedToken.save();

    if (!result) {
      return apiResponse.error(
        res,
        {},
        "Something went wrong while logging out!",
        424
      );
    }

    return apiResponse.success(res, {}, "Logged out successfully!");
  } catch (err) {
    next(err);
  }
};
