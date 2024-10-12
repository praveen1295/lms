import express from "express";
import {
  createTestCourse,
  getTestCourses,
  getTestCourseById,
  updateTestCourse,
  deleteTestCourse,
} from "../controllers/test.course.controller"; // Update the path according to your file structure
import { authorizeRoles, isAuthenticated } from "../middleware/auth";

const courseRouter = express.Router();

// Create a new course (Only admin can create)
courseRouter.post(
  "/create-test-course",
  isAuthenticated,
  authorizeRoles("admin"),
  createTestCourse
);

// Get all courses (Public access)
courseRouter.get("/get-test-courses", getTestCourses);

// Get a single course by ID (Public access)
courseRouter.get("/get-test-course/:id", getTestCourseById);

// Update a course by ID (Only admin can update)
courseRouter.put(
  "/update-test-course/:id",
  isAuthenticated,
  authorizeRoles("admin"),
  updateTestCourse
);

// Delete a course by ID (Only admin can delete)
courseRouter.delete(
  "/delete-test-course/:id",
  isAuthenticated,
  authorizeRoles("admin"),
  deleteTestCourse
);

export default courseRouter;
