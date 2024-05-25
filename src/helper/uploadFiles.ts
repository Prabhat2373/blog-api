import util from "util";
import multer from "multer";
import { GridFsStorage } from "multer-gridfs-storage";
import dbConfig from "@config/db.config";
import mongoose from "mongoose";
import Grid from "gridfs-stream";

export const mongoURI = "mongodb://127.0.0.1:27017/blog";

const promise = mongoose.connect(mongoURI);

const conn = mongoose.connection;
let gfs: any;

conn.once("open", () => {
  gfs = Grid(conn, mongoose.mongo);
  gfs.collection("uploads");
});

const storage = new GridFsStorage({
  db: promise,
  file: (req, file) => {
    const match = ["image/png", "image/jpeg", "svg/webp"];

    if (match.indexOf(file.mimetype) === -1) {
      const filename = `${Date.now()}-Images-${file.originalname}`;
      return filename;
    }

    return {
      bucketName: dbConfig.imgBucket,
      filename: `${Date.now()}-Images-${file.originalname}`,
    };
  },
});

const uploadFiles = multer({ storage: storage }).array("file", 10);
const Upload = util.promisify(uploadFiles);

export default Upload;
