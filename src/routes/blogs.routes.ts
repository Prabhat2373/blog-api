import express from "express";
import {
  createBlogPost,
  getBlogPost,
  likeBlogPost,
  commentOnBlogPost,
  shareBlogPost,
  getAllPosts,
  createDraft,
  updateDraft,
  publishDraft,
  getUserDrafts,
} from "../controllers/blogs.controller";
import { isAuthenticatedUser } from "@/middlewares/Auth";
import { uploadAndCompressFile } from "@/middlewares/file.upload";

const router = express.Router();

router.post(
  "/blogs",
  isAuthenticatedUser,
  uploadAndCompressFile("file"),
  createBlogPost
);
router.get("/blogs", getAllPosts);
router.get("/blogs/:id", getBlogPost);
router.post("/blogs/like/:id", isAuthenticatedUser, likeBlogPost);
router.post("/blogs/comment/:id", isAuthenticatedUser, commentOnBlogPost);
router.post("/blogs/share/:id", isAuthenticatedUser, shareBlogPost);
router.post("/blogs/draft", isAuthenticatedUser, createDraft);
router.put("/blogs/draft/:id", isAuthenticatedUser, updateDraft);
router.get("/blogs/drafts", isAuthenticatedUser, getUserDrafts);
router.put("/blogs/publish/:id", isAuthenticatedUser, publishDraft);

const blogRouter = router;
export default blogRouter;
