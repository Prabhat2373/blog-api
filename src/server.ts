import express, { Application } from "express";
import Connect from "./config/db.connect";
import app from "./app";

import dotenv from "dotenv";
dotenv.config({ path: "./.env" });

const PORT = 8001 || process.env.PORT;

// Handling Uncaught Exception
process.on("uncaughtException", (err) => {
  console.log(`Error: ${err.message}`);
  console.log(`Shutting down the server due to Uncaught Exception`);
  process.exit(1);
});

const db = "mongodb://127.0.0.1:27017/blog";
Connect(db);

const server = app.listen(PORT, () => console.log(`http://localhost:${PORT}`));

// Unhandled Promise Rejection
process.on("unhandledRejection", (err: Error) => {
  console.log(`Error: ${err.message}`);
  console.log(`Shutting down the server due to Unhandled Promise Rejection`);

  server.close(() => {
    process.exit(1); // for exiting process or closing server
  });
});
