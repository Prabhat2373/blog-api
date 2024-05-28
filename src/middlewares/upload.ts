// import util from "util";
// import multer from "multer";
// import { GridFsStorage } from "multer-gridfs-storage";
// import dbConfig from "@config/db.config";
// import mongoose from "mongoose";
// import Grid from "gridfs-stream";

// export const mongoURI = "mongodb://127.0.0.1:27017/blog";

// const promise = mongoose.connect(mongoURI);
// console.log("promise", promise);

// const conn = mongoose.connection;
// let gfs: any;

// conn.once("open", () => {
//   gfs = Grid(conn, mongoose.mongo);
//   gfs.collection("uploads");
// });

// const storage = new GridFsStorage({
//   db: promise,
//   file: (req, file) => {
//     const match = ["image/png", "image/jpeg", "svg/webp"];

//     if (match.indexOf(file.mimetype) === -1) {
//       const filename = `${Date.now()}-Images-${file.originalname}`;
//       return filename;
//     }

//     return {
//       bucketName: dbConfig.imgBucket,
//       filename: `${Date.now()}-Images-${file.originalname}`,
//     };
//   },
// });

// const uploadFiles = multer({ storage: storage }).array("file", 10);
// const Upload = util.promisify(uploadFiles);

// export const createUploadMiddleware = (fieldName: string) => {
//   const uploadFiles = multer({ storage: storage }).array(fieldName, 10);
//   return util.promisify(uploadFiles);
// };

// export default Upload;

// import util from "util";
// import multer from "multer";
// import { GridFsStorage } from "multer-gridfs-storage";
// import dbConfig from "@config/db.config";
// import mongoose from "mongoose";
// import Grid from "gridfs-stream";

// export const mongoURI = "mongodb://127.0.0.1:27017/blog";
// console.log("step1");
// const promise = mongoose
//   .connect(mongoURI)
//   .then((res) => {
//     console.log("connected");
//   })
//   .catch((err) => {
//     console.log("fail to connect:", err?.message);
//   });
// console.log("step2");
// const conn = mongoose.connection;
// let gfs: any;

// conn.once("open", () => {
//   gfs = Grid(conn, mongoose.mongo);
//   gfs.collection("uploads");
// });

// const storage = new GridFsStorage({
//   db: promise,
//   file: (req, file) => {
//     const match = ["image/png", "image/jpeg", "svg/webp"];
//     console.log("condition", match.indexOf(file.mimetype) === -1);
//     if (match.indexOf(file.mimetype) === -1) {
//       const filename = `${Date.now()}-Images-${file.originalname}`;
//       return filename;
//     }

//     return {
//       bucketName: dbConfig.imgBucket,
//       filename: `${Date.now()}-Images-${file.originalname}`,
//     };
//   },
// });

// const uploadFiles = multer({ storage: storage }).array("file", 10);
// const Upload = util.promisify(uploadFiles);

// export default Upload;

import util from "util";
import multer from "multer";
import { GridFsStorage } from "multer-gridfs-storage";
import dbConfig from "@config/db.config";
import mongoose from "mongoose";
import Grid from "gridfs-stream";

// MongoDB URI
const mongoURI = "mongodb://127.0.0.1:27017/blog";

// Connect to MongoDB
const promise = mongoose
  .connect(mongoURI, {
    useNewUrlParser: true,
  })
  .then((res) => {
    console.log("connn");
  })
  .catch((err) => {
    console.log("error", err);
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
