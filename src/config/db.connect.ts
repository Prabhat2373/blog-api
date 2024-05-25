import mongoose from "mongoose";

export default (db: string) => {
  const connect = () => {
    mongoose
      .connect(db)
      .then(() => {
        console.info(`Successfully connected to ${db}`);
      })
      .catch((err) => {
        console.error(`Error connecting to database: ${err}`);
        throw err;
      });
  };

  connect();

  mongoose.connection.on("error", (err) => {
    console.error(`Database error: ${err}`);
    throw err;
  });

  mongoose.connection.on("disconnected", () => {
    console.warn(`Lost database connection. Retrying...`);
    connect();
  });
};
