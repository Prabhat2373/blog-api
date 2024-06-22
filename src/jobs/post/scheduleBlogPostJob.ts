import Blog from "@/models/blogs.model";
import cron from "node-cron";
import mongoose from "mongoose";
// import BlogPost from "./models/blogPost.model";

require("dotenv").config({
  path: "../.env",
});

// Connect to the database
mongoose
  .connect(process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/blog", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Database connected successfully");
  })
  .catch((err) => {
    console.error("Database connection error:", err);
  });

const schedulePostPublishing = () => {
  cron.schedule("* * * * *", async () => {
    try {
      console.log("scheduling blog");
      const now = new Date();
      const posts = await Blog.find({
        status: "scheduled",
        scheduledAt: { $lte: now },
      });

      console.log("posts", posts);

      for (const post of posts) {
        console.log("singlepost", post);
        post.status = "published";
        console.log("updatedpost", post);
        await post.save();
      }
    } catch (err) {
      console.log("CRON ERROR:", err?.message);
    }
  });
};

export default schedulePostPublishing;
