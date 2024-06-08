import {
  followUser,
  getAllAuthors,
  getAuthor,
  getUser,
  loginUser,
  registerUser,
  unfollowUser,
} from "@/controllers/user.controller";
import { isAuthenticatedUser } from "@/middlewares/Auth";
import { Router } from "express";
const accountRouter = Router();

accountRouter.post("/login", loginUser);
accountRouter.post("/register", registerUser);

accountRouter.get("/profile", isAuthenticatedUser, getUser);
accountRouter.get("/author/profile/:authorId", isAuthenticatedUser, getAuthor);
accountRouter.post("/follow/:id", isAuthenticatedUser, followUser);
accountRouter.post("/unfollow/:id", isAuthenticatedUser, unfollowUser);
accountRouter.get("/authors/all", isAuthenticatedUser, getAllAuthors);

export default accountRouter;
