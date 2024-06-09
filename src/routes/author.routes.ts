import { getAuthorPosts } from "@/controllers/author.controller";
import { isAuthenticatedUser } from "@/middlewares/Auth";
import express from "express";

const router = express.Router();

router.get("/author/:id/posts", isAuthenticatedUser, getAuthorPosts);

const authorRoutes = router;

export default authorRoutes;
