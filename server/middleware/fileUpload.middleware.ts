// // import { existsSync, mkdirSync } from "fs";
// // import multer from "multer";
// // import path from "path";

// // // Correctly resolve the root directory
// // export const rootDir = path.resolve(__dirname, "../../");

// // // http://localhost:8000/api/v1/static/pdf_files/project_file.pdf

// // // Create directories if they don't exist
// // if (!existsSync(path.join(rootDir, "PDF_FILES"))) {
// //   mkdirSync(path.join(rootDir, "PDF_FILES"));
// // }
// // if (!existsSync(path.join(rootDir, "THUMBNAIL"))) {
// //   mkdirSync(path.join(rootDir, "THUMBNAIL"));
// // }
// // if (!existsSync(path.join(rootDir, "QUESTION_IMG"))) {
// //   mkdirSync(path.join(rootDir, "QUESTION_IMG"));
// // }

// // // Configure Multer storage
// // const storage = multer.diskStorage({
// //   destination: (req: any, file: any, cb: any) => {
// //     if (file.fieldname === "coarsePdf") {
// //       cb(null, path.join(rootDir, "PDF_FILES"));
// //     } else if (file.fieldname === "thumbnail") {
// //       cb(null, path.join(rootDir, "THUMBNAIL"));
// //     } else if (file.fieldname === "newQuestionImages") {
// //       cb(null, path.join(rootDir, "QUESTION_IMG"));
// //     }
// //   },
// //   filename: (req: any, file: any, cb: any) => {
// //     cb(null, file.originalname.split(" ").join("_"));
// //   },
// // });

// // // Initialize Multer upload
// // const upload = multer({ storage: storage });
// // export { upload };

// import multer from "multer";
// import path from "path";
// import { existsSync, mkdirSync } from "fs";

// export const rootDir = path.resolve(__dirname, "../../");

// // Create directories if they don't exist
// ["PDF_FILES", "THUMBNAIL", "QUESTION_IMG"].forEach((dir) => {
//   const fullPath = path.join(rootDir, dir);
//   if (!existsSync(fullPath)) mkdirSync(fullPath);
// });

// const storage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     if (file.fieldname === "questionList[0][newQuestionImages]") {
//       cb(null, path.join(rootDir, "QUESTION_IMG"));
//     } else if (file.fieldname === "thumbnail") {
//       cb(null, path.join(rootDir, "THUMBNAIL"));
//     } else if (file.fieldname === "coarsePdf") {
//       cb(null, path.join(rootDir, "PDF_FILES"));
//     } else {
//       cb(null, path.join(rootDir, "QUESTION_IMG"));
//     }
//   },
//   filename: (req, file, cb) => {
//     cb(null, `${Date.now()}_${file.originalname.split(" ").join("_")}`);
//   },
// });

// const upload = multer({ storage });

// // Allow multiple files in FormData
// const cpUpload = upload.fields([
//   { name: "thumbnail", maxCount: 1 },
//   { name: "coarsePdf", maxCount: 1 },
//   { name: "questionList[0][newQuestionImages]", maxCount: 1 },
//   { name: "questionList[1][newQuestionImages]", maxCount: 1 },
//   // Add more as needed for each question's image file
// ]);

// export { cpUpload };

import multer from "multer";
import path from "path";
import { existsSync, mkdirSync } from "fs";

export const rootDir = path.resolve(__dirname, "../../");

// Create directories if they don't exist
["PDF_FILES", "THUMBNAIL", "QUESTION_IMG"].forEach((dir) => {
  const fullPath = path.join(rootDir, dir);
  if (!existsSync(fullPath)) mkdirSync(fullPath);
});

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    if (
      file.fieldname.startsWith("questionList") &&
      file.fieldname.endsWith("[newQuestionImages]")
    ) {
      cb(null, path.join(rootDir, "QUESTION_IMG"));
    } else if (file.fieldname === "thumbnail") {
      cb(null, path.join(rootDir, "THUMBNAIL"));
    } else if (file.fieldname === "coarsePdf") {
      cb(null, path.join(rootDir, "PDF_FILES"));
    }
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}_${file.originalname.split(" ").join("_")}`);
  },
});

const upload = multer({ storage });

// Dynamically add newQuestionImages fields for multiple questions
const newQuestionImagesFields = Array.from({ length: 10 }, (_, index) => ({
  name: `questionList[${index}][newQuestionImages]`,
  maxCount: 5,
}));

const cpUpload = upload.fields([
  { name: "thumbnail", maxCount: 1 },
  { name: "coarsePdf", maxCount: 1 },
  ...newQuestionImagesFields, // Spread the dynamically created fields
]);

export { cpUpload };
