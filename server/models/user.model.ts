// require("dotenv").config();
// import mongoose, { Document, Model, Schema } from "mongoose";
// import bcrypt from "bcryptjs";
// import jwt from "jsonwebtoken";

// const emailRegexPattern: RegExp = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// export interface IUser extends Document {
//   name: string;
//   email: string;
//   password: string;
//   avatar: {
//     public_id: string;
//     url: string;
//   };
//   role: string;
//   isVerified: boolean;
//   courses: Array<{ courseId: string }>;
//   comparePassword: (password: string) => Promise<boolean>;
//   SignAccessToken: () => string;
//   SignRefreshToken: () => string;
// }

// const userSchema: Schema<IUser> = new mongoose.Schema(
//   {
//     name: {
//       type: String,
//       required: [true, "Please enter your name"],
//     },
//     email: {
//       type: String,
//       required: [true, "Please enter your email"],
//       validate: {
//         validator: function (value: string) {
//           return emailRegexPattern.test(value);
//         },
//         message: "please enter a valid email",
//       },
//       unique: true,
//     },
//     password: {
//       type: String,
//       minlength: [6, "Password must be at least 6 characters"],
//       select: false,
//     },
//     avatar: {
//       public_id: String,
//       url: String,
//     },
//     role: {
//       type: String,
//       default: "user",
//     },
//     isVerified: {
//       type: Boolean,
//       default: false,
//     },
//     courses: [
//       {
//         courseId: String,
//       },
//     ],
//   },
//   { timestamps: true }
// );

// // Hash Password before saving
// userSchema.pre<IUser>("save", async function (next) {
//   if (!this.isModified("password")) {
//     next();
//   }
//   this.password = await bcrypt.hash(this.password, 10);
//   next();
// });

// // sign access token
// userSchema.methods.SignAccessToken = function () {
//   return jwt.sign({ id: this._id }, process.env.ACCESS_TOKEN || "", {
//     expiresIn: "5m",
//   });
// };

// // sign refresh token
// userSchema.methods.SignRefreshToken = function () {
//   return jwt.sign({ id: this._id }, process.env.REFRESH_TOKEN || "", {
//     expiresIn: "3d",
//   });
// };

// // compare password
// userSchema.methods.comparePassword = async function (
//   enteredPassword: string
// ): Promise<boolean> {
//   return await bcrypt.compare(enteredPassword, this.password);
// };

// const userModel: Model<IUser> = mongoose.model("User", userSchema);

// export default userModel;

require("dotenv").config();
import mongoose, { Document, Model, Schema } from "mongoose";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import crypto from "crypto";

const emailRegexPattern: RegExp = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  avatar: {
    public_id: string;
    url: string;
  };
  role: string;
  isVerified: boolean;
  isDeactivated: boolean;
  remainingTry: number;
  temperoryKey: string;
  freezeTime: Date;
  accountBlocked: boolean;
  isTempKeyUsed: boolean;
  courses: Array<{ courseId: string }>;
  resetPasswordToken: String | undefined;
  resetPasswordExpire: Date | undefined;
  tests: Array<{ testId: string }>;

  comparePassword: (password: string) => Promise<boolean>;
  getResetPasswordToken: any;
  SignAccessToken: () => string;
  SignRefreshToken: () => string;
}

const userSchema: Schema<IUser> = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Please enter your name"],
    },
    email: {
      type: String,
      required: [true, "Please enter your email"],
      validate: {
        validator: function (value: string) {
          return emailRegexPattern.test(value);
        },
        message: "Please enter a valid email",
      },
      unique: true,
    },
    password: {
      type: String,
      minlength: [6, "Password must be at least 6 characters"],
      select: false,
    },
    avatar: {
      public_id: String,
      url: String,
    },
    role: {
      type: String,
      default: "user",
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    isDeactivated: {
      type: Boolean,
      default: false,
    },
    remainingTry: {
      type: Number,
      default: 3,
    },
    temperoryKey: {
      type: String,
      default: "",
    },
    freezeTime: {
      type: Date,
      default: new Date(),
    },
    accountBlocked: {
      type: Boolean,
      default: false,
    },
    isTempKeyUsed: {
      type: Boolean,
      default: false,
    },
    courses: [
      {
        courseId: String,
      },
    ],
    tests: [
      {
        testId: String,
      },
    ],
    resetPasswordToken: { type: String || undefined },
    resetPasswordExpire: { type: Date || undefined },
  },
  { timestamps: true }
);

// Hash password before saving
userSchema.pre<IUser>("save", async function (next) {
  if (!this.isModified("password")) {
    next();
  }
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

// Sign access token
userSchema.methods.SignAccessToken = function () {
  return jwt.sign({ id: this._id }, process.env.ACCESS_TOKEN || "", {
    expiresIn: "5m",
  });
};

// Sign refresh token
userSchema.methods.SignRefreshToken = function () {
  return jwt.sign({ id: this._id }, process.env.REFRESH_TOKEN || "", {
    expiresIn: "3d",
  });
};

// Compare password
userSchema.methods.comparePassword = async function (
  enteredPassword: string
): Promise<boolean> {
  return await bcrypt.compare(enteredPassword, this.password);
};

userSchema.methods.getResetPasswordToken = function () {
  // Generate token
  const resetToken = crypto.randomBytes(20).toString("hex");

  // Hash the token and set it to the resetPasswordToken field
  this.resetPasswordToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");

  // Set token expiration time (e.g., 15 minutes)
  this.resetPasswordExpire = Date.now() + 15 * 60 * 1000; // 15 minutes

  return resetToken; // Return the plain reset token (to be sent to the user via email)
};

const userModel: Model<IUser> = mongoose.model("User", userSchema);

export default userModel;
