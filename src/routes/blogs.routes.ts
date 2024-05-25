import express from "express";
import {
  createBlogPost,
  getBlogPost,
  likeBlogPost,
  commentOnBlogPost,
  shareBlogPost,
} from "../controllers/blogs.controller";
import { isAuthenticatedUser } from "@/middlewares/Auth";

const router = express.Router();

router.post("/blogs", isAuthenticatedUser, createBlogPost);
router.get("/blogs/:id", isAuthenticatedUser, getBlogPost);
router.post("/blogs/like/:id", isAuthenticatedUser, likeBlogPost);
router.post("/blogs/comment/:id", isAuthenticatedUser, commentOnBlogPost);
router.post("/blogs/share/:id", isAuthenticatedUser, shareBlogPost);

const blogRouter = router;
export default blogRouter;
