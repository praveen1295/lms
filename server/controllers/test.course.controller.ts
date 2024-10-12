import { Request, Response } from "express";
import TestCourseModel from "../models/test.course.model"; // Update with the correct path to your course model

// Create a new course
export const createTestCourse = async (req: Request, res: Response) => {
  try {
    const course = new TestCourseModel(req.body);
    await course.save();
    res
      .status(201)
      .json({ message: "Test course created successfully", course });
  } catch (error) {
    res.status(400).json({ message: "Error creating course", error });
  }
};

// Get all courses
export const getTestCourses = async (_req: Request, res: Response) => {
  try {
    const testCourses = await TestCourseModel.find();
    res.status(200).json({ testCourses });
  } catch (error) {
    res.status(500).json({ message: "Error fetching courses", error });
  }
};

// Get a single course by ID
export const getTestCourseById = async (req: Request, res: Response) => {
  try {
    const course = await TestCourseModel.findById(req.params.id);
    if (!course) {
      return res.status(404).json({ message: "Test course not found" });
    }
    res.status(200).json({ course });
  } catch (error) {
    res.status(500).json({ message: "Error fetching course", error });
  }
};

// Update a course by ID
export const updateTestCourse = async (req: Request, res: Response) => {
  try {
    const updatedCourse = await TestCourseModel.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!updatedCourse) {
      return res.status(404).json({ message: "Test course not found" });
    }
    res
      .status(200)
      .json({ message: "Test course updated successfully", updatedCourse });
  } catch (error) {
    res.status(400).json({ message: "Error updating course", error });
  }
};

// Delete a course by ID
export const deleteTestCourse = async (req: Request, res: Response) => {
  try {
    const deletedCourse = await TestCourseModel.findByIdAndDelete(
      req.params.id
    );
    if (!deletedCourse) {
      return res.status(404).json({ message: "Test course not found" });
    }
    res.status(200).json({ message: "Test course deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting course", error });
  }
};
