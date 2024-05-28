import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import cors from "cors";
import express, { Application } from "express";
import { download } from "./helper/downloadImage";
import { ErrorMiddleware } from "./middlewares/error";
// import { companyRoutes } from "./routes/company.routes";

import corsConfig from "./config/cors.config";
import accountRouter from "./routes/account.routes";
import blogRouter from "./routes/blogs.routes";
import authRouter from "./routes/auth.routes";

const app: Application = express();

app.use(corsConfig);

app.use(express.json());

app.use(express.urlencoded({ extended: true }));
// app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
// ROUTES
app.use("/api/v1", accountRouter);
app.use("/api/v1", blogRouter);
app.use("/api/v1", authRouter);

app.get("/api/v1/files/:name", download);
app.get("/api/v1/uploads/:name", download);
// TEST ONLY
app.get("/", (req, res) => {
  res.status(200).json({
    status: "success",
    message: "connection success!",
  });
});

app.get("*", (req, res) => {
  res.status(404).json({
    success: false,
    message: "NO ROUTE FOUND!",
  });
});

app.use(ErrorMiddleware);
export default app;
