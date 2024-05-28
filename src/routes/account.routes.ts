import {
  followUser,
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
accountRouter.post("/follow/:id", isAuthenticatedUser, followUser);
accountRouter.post("/unfollow/:id", isAuthenticatedUser, unfollowUser);

export default accountRouter;
