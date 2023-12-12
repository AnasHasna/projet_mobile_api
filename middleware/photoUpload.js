import path from "path";
import multer from "multer";

// photo storage
const photoStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, "../images"));
  },
  filename: (req, file, cb) => {
    if (file) {
      cb(null, new Date().toISOString().replace(/:/g, "-") + file.originalname);
    } else {
      cb(null, false);
    }
  },
});

// Photo Upload middleware
const photoUpload = multer({
  storage: photoStorage,
  fileFilter: (req, file, cb) => {
    // make condition is there is no file
    if (!file) {
      cb({ message: "No file provided" }, false);
    } else {
      // Get the file extension from the original filename
      const fileExtension = file.originalname.split(".").pop();

      // List of allowed image file extensions
      const allowedExtensions = ["jpg", "jpeg", "png", "gif"];

      // Check if the file extension is in the allowed list
      if (allowedExtensions.includes(fileExtension.toLowerCase())) {
        cb(null, true);
      } else {
        cb({ message: "Unsupported file format" }, false);
      }
    }
  },
  limits: {
    fileSize: 10 * 1024 * 1024, // 10 megabyte
  },
});

export default photoUpload;
