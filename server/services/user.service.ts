import { Response } from "express";
// import { redis } from "../utils/redis";
import userModel from "../models/user.model";

// get user by id
// export const getUserById = async (id: string, res: Response) => {
//   // const userJson = await redis.get(id);

//   // if (userJson) {
//   //   const user = JSON.parse(userJson);
//   //   res.status(201).json({
//   //     success: true,
//   //     user,
//   //   });
//   // }
// };



export const getUserById = async (id: string, res: Response) => {

  try {
    // Fetch user from the database by ID
    const user = await userModel.findById(id);

    console.log('user', user)

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};


// Get All users
export const getAllUsersService = async (res: Response) => {
  const users = await userModel.find().sort({ createdAt: -1 });

  res.status(201).json({
    success: true,
    users,
  });
};

// update user role
export const updateUserRoleService = async (res:Response,id: string,role:string) => {
  const user = await userModel.findByIdAndUpdate(id, { role }, { new: true });

  res.status(201).json({
    success: true,
    user,
  });
}