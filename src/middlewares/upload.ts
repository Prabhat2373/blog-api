import util from "util";
import multer from "multer";
import { GridFsStorage } from "multer-gridfs-storage";
import dbConfig from "@config/db.config";
import mongoose from "mongoose";
import Grid from "gridfs-stream";

// MongoDB URI
export const mongoURI = "mongodb://127.0.0.1:27017/blog";

// Connect to MongoDB
const promise = mongoose.connect(mongoURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Initialize GridFS
let gfs: any;
const conn = mongoose.connection;
conn.once("open", () => {
  gfs = Grid(conn.db, mongoose.mongo);
  gfs.collection("uploads");
  console.log("GridFS connection established");
});

// Configure multer storage using GridFS
const storage = new GridFsStorage({
  db: promise, // Use the promise returned by mongoose.connect
  file: (req, file) => {
    const match = ["image/png", "image/jpeg", "image/webp"];

    if (match.indexOf(file.mimetype) === -1) {
      const filename = `${Date.now()}-Images-${file.originalname}`;
      return filename;
    }

    return {
      bucketName: dbConfig.imgBucket, // Ensure imgBucket is defined in dbConfig
      filename: `${Date.now()}-Images-${file.originalname}`,
    };
  },
});

// Initialize multer with the storage configuration
const uploadFiles = multer({ storage: storage }).array("file", 10);
const Upload = util.promisify(uploadFiles);

export default Upload;
