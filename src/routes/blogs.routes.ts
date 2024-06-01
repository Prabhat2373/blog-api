import express from "express";
import {
  createBlogPost,
  getBlogPost,
  likeBlogPost,
  commentOnBlogPost,
  shareBlogPost,
  getAllPosts,
  updateDraft,
  publishDraft,
  getUserDrafts,
  createOrUpdateDraft,
  getPostComments,
  replyToComment,
  getRepliesForComment,
  deleteReply,
  deleteComment,
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
router.post(
  "/posts/drafts",
  uploadAndCompressFile("file", true),
  isAuthenticatedUser,
  createOrUpdateDraft
);
router.put("/posts/drafts/:id", isAuthenticatedUser, updateDraft);
router.get("/posts/drafts", isAuthenticatedUser, getUserDrafts);
router.put("/posts/drafts/publish/:id", isAuthenticatedUser, publishDraft);
router.get("/posts/comments/:id", isAuthenticatedUser, getPostComments);
router.delete("/posts/comments/:id", isAuthenticatedUser, deleteComment);

// Reply routes
router.post("/comment/:commentId/reply", isAuthenticatedUser, replyToComment);
router.get("/comment/:commentId/replies", getRepliesForComment);
router.delete("/comment/replies/:replyId",isAuthenticatedUser, deleteReply);

const blogRouter = router;
export default blogRouter;
