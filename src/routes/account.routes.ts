import {
  followUser,
  getUser,
  loginUser,
  registerUser,
  unfollowUser,
} from "@/controllers/user.controller";
import { Router } from "express";
const accountRouter = Router();

accountRouter.post("/login", loginUser);
accountRouter.post("/register", registerUser);

accountRouter.get("/:id", getUser);
accountRouter.post("/follow/:id", followUser);
accountRouter.post("/unfollow/:id", unfollowUser);

export default accountRouter;
