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
    description: {
      type: String,
    },
    testCategory: {
      type: String,
      require: true,
    },
    examName: {
      type: String,
      required: true,
      // enum: ["nursing, GNST/PNST"],
    },
    duration: {
      type: Number,
      required: true,
    },

    isShowTimer: {
      type: Boolean,
      require: true,
    },

    isShuffle: {
      type: Boolean,
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
        questionImages: {
          type: Array,
          default: [],
        },
      },
    ],
    answers: {
      type: Object,
      require: true,
    },
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
      default: false,
      required: true,
    },
    allowedUser: {
      type: [],
      default: [],
    },
    attemptsAllowedPerUser: {
      //how many times quiz can be attempted by user
      type: Number, //required is false, if not provided quiz can be attempted multiple times
    },
    attemptedUsers: [
      //Stores an array of objects users who have attempted the quiz
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
    isDemo: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

const Quiz = mongoose.model("Quiz", quizSchema);

export default Quiz;
