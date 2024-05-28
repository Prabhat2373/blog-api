// import multer from "multer";
// import sharp from "sharp";
// import { MongoClient, GridFSBucket } from "mongodb";
// import path from "path";
// import fs from "fs";
// import { mongoURI } from "@/helper/uploadFiles";

// const upload = multer({ dest: "uploads/" });

// const client = new MongoClient(mongoURI, {
//   useNewUrlParser: true,
//   useUnifiedTopology: true,
// });

// client
//   .connect()
//   .then(() => {
//     console.log("Connected to MongoDB");
//   })
//   .catch((error) => {
//     console.error("Failed to connect to MongoDB", error);
//   });

// const db = client.db("blog");
// const bucket = new GridFSBucket(db, { bucketName: "uploads" });

// export const uploadAndCompressFile = (
//   fieldName: string,
//   optional?: boolean
// ) => {
//   return (req: any, res: any, next: any) => {
//     const uploadSingle = upload.single(fieldName);

//     uploadSingle(req, res, (err: any) => {
//       if (err) {
//         return next(err);
//       }

//       if (!req.file) {
//         return next(new Error("No file uploaded"));
//       }

//       const filename = `${Date.now()}-${req.file.originalname}`;
//       const outputPath = path.join("uploads", filename);

//       sharp(req.file.path)
//         .resize(800) // Example resize to 800px width, maintain aspect ratio
//         .toFile(outputPath, (err, info) => {
//           if (err) {
//             return next(err);
//           }

//           const uploadStream = bucket.openUploadStream(filename, {
//             metadata: {
//               originalname: req.file.originalname,
//               size: info.size,
//               mimetype: req.file.mimetype,
//               file_name: filename,
//             },
//           });

//           uploadStream.on("error", (error) => {
//             return next(error);
//           });

//           uploadStream.on("finish", () => {
//             fs.unlink(req.file.path, (unlinkErr) => {
//               if (unlinkErr) {
//                 console.error("Failed to delete temporary file", unlinkErr);
//               }
//             });

//             fs.unlink(outputPath, (unlinkErr) => {
//               if (unlinkErr) {
//                 console.error("Failed to delete compressed file", unlinkErr);
//               }
//             });

//             req.fileUpload = {
//               id: uploadStream.id,
//               filename: uploadStream.filename,
//               metadata: uploadStream.metadata,
//               file_name: filename,
//             };

//             next();
//           });

//           fs.createReadStream(outputPath).pipe(uploadStream);
//         });
//     });
//   };
// };

import multer from "multer";
import sharp from "sharp";
import { MongoClient, GridFSBucket } from "mongodb";
import path from "path";
import fs from "fs";
import { mongoURI } from "@/helper/uploadFiles";

const upload = multer({ dest: "uploads/" });

const client = new MongoClient(mongoURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

client
  .connect()
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((error) => {
    console.error("Failed to connect to MongoDB", error);
  });

const db = client.db("blog");
const bucket = new GridFSBucket(db, { bucketName: "uploads" });

export const uploadAndCompressFile = (
  fieldName: string,
  optional: boolean = false
) => {
  return (req: any, res: any, next: any) => {
    const uploadSingle = upload.single(fieldName);

    uploadSingle(req, res, (err: any) => {
      if (err) {
        return next(err);
      }

      if (!req.file) {
        if (optional) {
          // Proceed without an error if the upload is optional
          return next();
        } else {
          return next(new Error("No file uploaded"));
        }
      }

      const filename = `${Date.now()}-${req.file.originalname}`;
      const outputPath = path.join("uploads", filename);

      sharp(req.file.path)
        .resize(800) // Example resize to 800px width, maintain aspect ratio
        .toFile(outputPath, (err, info) => {
          if (err) {
            return next(err);
          }

          const uploadStream = bucket.openUploadStream(filename, {
            metadata: {
              originalname: req.file.originalname,
              size: info.size,
              mimetype: req.file.mimetype,
              file_name: filename,
            },
          });

          uploadStream.on("error", (error) => {
            return next(error);
          });

          uploadStream.on("finish", () => {
            fs.unlink(req.file.path, (unlinkErr) => {
              if (unlinkErr) {
                console.error("Failed to delete temporary file", unlinkErr);
              }
            });

            fs.unlink(outputPath, (unlinkErr) => {
              if (unlinkErr) {
                console.error("Failed to delete compressed file", unlinkErr);
              }
            });

            req.fileUpload = {
              id: uploadStream.id,
              filename: uploadStream.filename,
              metadata: uploadStream.metadata,
              file_name: filename,
            };

            next();
          });

          fs.createReadStream(outputPath).pipe(uploadStream);
        });
    });
  };
};
