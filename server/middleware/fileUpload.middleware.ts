import { existsSync, mkdirSync } from "fs";
import multer from "multer";
import path from "path";

// Correctly resolve the root directory
export const rootDir = path.resolve(__dirname, "../../");
console.log("rootDir", rootDir);

// http://localhost:8000/api/v1/static/pdf_files/project_file.pdf

// Create directories if they don't exist
if (!existsSync(path.join(rootDir, "PDF_FILES"))) {
  mkdirSync(path.join(rootDir, "PDF_FILES"));
}
if (!existsSync(path.join(rootDir, "THUMBNAIL"))) {
  mkdirSync(path.join(rootDir, "THUMBNAIL"));
}

// Configure Multer storage
const storage = multer.diskStorage({
  destination: (req: any, file: any, cb: any) => {
    if (file.fieldname === "coarsePdf") {
      cb(null, path.join(rootDir, "PDF_FILES"));
    } else if (file.fieldname === "thumbnail") {
      cb(null, path.join(rootDir, "THUMBNAIL"));
    }
  },
  filename: (req: any, file: any, cb: any) => {
    cb(null, file.originalname.split(" ").join("_"));
  },
});

// Initialize Multer upload
const upload = multer({ storage: storage });
export { upload };
