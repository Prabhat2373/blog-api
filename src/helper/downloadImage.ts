import { Request, Response } from "express";
import { MongoClient } from "mongodb";
import { GridFSBucket } from "mongodb";
import dbConfig from "@config/db.config";
import { mongoURI } from "@/middlewares/upload";

const download = async (req: Request, res: Response): Promise<void> => {
  try {
    const mongoClient = new MongoClient(mongoURI);
    await mongoClient.connect();

    const database = mongoClient.db(dbConfig.database);
    const bucket = new GridFSBucket(database, {
      bucketName: dbConfig.imgBucket,
    });

    const downloadStream = bucket.openDownloadStreamByName(req.params.name);

    downloadStream.on("data", function (data) {
      res.status(200).write(data);
    });

    downloadStream.on("error", function (err) {
      res.status(404).send({
        message: "Cannot download the Image!" + err.message,
      });
    });

    downloadStream.on("end", () => {
      res.end();
    });
  } catch (error) {
    res.status(500).send({
      message: error.message,
    });
  }
};

export { download };
