import cors from "cors";
const corsConfig = cors({
  origin: "*",
  credentials: true,
  exposedHeaders: ["Set-Cookie", "Date", "ETag", "sameSite"],
});

export default corsConfig;
