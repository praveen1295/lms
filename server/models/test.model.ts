import mongoose from "mongoose";

const schema = mongoose.Schema;
//schema
const quizSchema = new schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
    },
    category: {
      type: String,
      required: true,
    },
    difficultyLevel: {
      type: String,
      required: true,
      enum: ["easy", "medium", "hard"],
    },
    questionList: [
      {
        questionNumber: Number,
        question: String,
        options: {},
      },
    ],
    answers: {},
    passingPercentage: {
      type: Number,
      required: true,
    },
    createdBy: {
      type: mongoose.Types.ObjectId,
      required: true,
    },
    isPublished: {
      type: Boolean,
      default: false,
    },

    isPublicQuiz: {
      type: Boolean,
      required: true,
    },
    allowedUser: {
      type: [],
      default: [],
    },
    attemptsAllowedPerUser: {
      //how many times test can be attempted by user
      type: Number, //required is false, if not provided test can be attempted multiple times
    },
    attemptedUsers: [
      //Stores an array of objects users who have attempted the test
      {
        //and number of attempts left
        id: String,
        attemptsLeft: Number,
      },
    ],

    isPaid: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

const Test = mongoose.model("Test", quizSchema);

export default Test;
