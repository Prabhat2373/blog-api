import Upload from "@/middlewares/upload";

import { Request, Response } from "express";
import catchAsyncErrors from "../middlewares/catchAsyncErrors";
import UserAccount, { IUserAccount, UserRole } from "../models/account.model";

import sendToken from "../utils/jwtToken";
import { sendApiResponse } from "../utils/utils";
import { RequestType } from "@/constants/AppConstants";

export const BASE_URL = "http://localhost:8001/api/v1/files/";

export const registerUser = catchAsyncErrors(
  async (req: Request, res: Response) => {
    await Upload(req, res);
    const { name, email, password } = req.body;
    // Create a new user account
    console.log("file", req.files);

    const userAccount: IUserAccount = new UserAccount({
      name,
      email,
      password,

      avatar:
        req.files && req.files?.length ? BASE_URL + req.files[0].filename : "",
    });
    console.log("userAccount", userAccount);

    // Save the user account to the database
    const savedUserAccount = await userAccount.save();

    sendToken(savedUserAccount, savedUserAccount, 200, res);
  }
);

export const loginUser = catchAsyncErrors(
  async (req: Request, res: Response) => {
    const { email, password } = req.body;
    console.log("email", email);

    // Find the user account by email
    const userAccount = await UserAccount.findOne({
      email,
    });

    console.log("userAccount", userAccount);

    // If the user account doesn't exist, return an error
    if (!userAccount) {
      // return res.status(401).json({ error: "Invalid email or password" });
      return sendApiResponse(
        res,
        "error",
        null,
        "Invalid email or password",
        401
      );
    }

    // Check if the password matches
    const isMatch = await userAccount.comparePassword(password);
    if (!isMatch) {
      // return res.status(401).json({ error: "Invalid email or password" });
      return sendApiResponse(
        res,
        "error",
        null,
        "Invalid email or password",
        401
      );
    }

    sendToken(userAccount, userAccount, 200, res);
  }
);

export const getUser = catchAsyncErrors(
  async (req: RequestType, res: Response) => {
    // Find the user account by ID
    console.log("req", req.user);

    if (req.user) {
      const userAccount: IUserAccount | null = await UserAccount.findById(
        req.user._id
      ).select("-password");

      console.log("userAccount", userAccount);

      // If the user account doesn't exist, return an error
      if (!userAccount) {
        // return res.status(404).json({ error: "User not found" });
        return sendApiResponse(res, "error", null, "User Not Found!", 400);
      }

      return sendApiResponse(
        res,
        "success",
        userAccount,
        "User Found Successfully"
      );
    } else {
      return sendApiResponse(res, "fail", {}, "Account not found", 401);
    }
  }
);

export const followUser = catchAsyncErrors(
  async (req: RequestType, res: Response) => {
    const user = await UserAccount.findById(req.user.id);
    const userToFollow = await UserAccount.findById(req.params.id);
    if (user && userToFollow && !user.following.includes(userToFollow._id)) {
      user.following.push(userToFollow._id);
      userToFollow.followers.push(user._id);
      await user.save();
      await userToFollow.save();
      res.status(200).json({ message: "User followed successfully" });
    } else {
      res.status(400).json({ message: "User already followed" });
    }
  }
);

export const unfollowUser = catchAsyncErrors(
  async (req: RequestType, res: Response) => {
    const user = await UserAccount.findById(req.user.id);
    const userToUnfollow = await UserAccount.findById(req.params.id);
    if (user && userToUnfollow && user.following.includes(userToUnfollow._id)) {
      user.following = user.following.filter(
        (id) => id.toString() !== userToUnfollow._id.toString()
      );
      userToUnfollow.followers = userToUnfollow.followers.filter(
        (id) => id.toString() !== user._id.toString()
      );
      await user.save();
      await userToUnfollow.save();
      res.status(200).json({ message: "User unfollowed successfully" });
    } else {
      res.status(400).json({ message: "User not followed" });
    }
  }
);
