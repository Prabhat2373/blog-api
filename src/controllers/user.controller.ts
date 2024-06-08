import Upload from "@/middlewares/upload";

import { Request, Response } from "express";
import catchAsyncErrors from "../middlewares/catchAsyncErrors";
import UserAccount, { IUserAccount, UserRole } from "../models/account.model";

import sendToken from "../utils/jwtToken";
import { sendApiResponse } from "../utils/utils";
import { RequestType } from "@/constants/AppConstants";
import Blog from "@/models/blogs.model";

export const BASE_URL = "http://localhost:8001/api/v1/uploads/";

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

// export const getUser = catchAsyncErrors(
//   async (req: RequestType, res: Response) => {
//     // Find the user account by ID
//     console.log("req", req.user);

//     if (req.user) {
//       const userAccount: IUserAccount | null = await UserAccount.aggregate([
//         { $match: { _id: req.user._id } },
//         {
//           $lookup: {
//             from: "posts", // Make sure the collection name matches your BlogPost collection name
//             localField: "_id",
//             foreignField: "author",
//             as: "articles",
//           },
//         },
//         { $project: { password: 0 } }, // Exclude the password field
//       ]);

//       console.log("userAccount", userAccount);

//       // If the user account doesn't exist, return an error
//       if (!userAccount?.[0]) {
//         // return res.status(404).json({ error: "User not found" });
//         return sendApiResponse(res, "error", null, "User Not Found!", 400);
//       }

//       return sendApiResponse(
//         res,
//         "success",
//         userAccount?.[0],
//         "User Found Successfully"
//       );
//     } else {
//       return sendApiResponse(res, "fail", {}, "Account not found", 401);
//     }
//   }
// );

export const getUser = catchAsyncErrors(
  async (req: RequestType, res: Response) => {
    if (req.user) {
      // Fetch user account without password
      const userAccount = await UserAccount.findById(req.user._id)
        .select("-password")
        .exec();

      if (!userAccount) {
        return sendApiResponse(res, "error", null, "User not found", 400);
      }

      // Fetch articles for the user
      const articles = await Blog.find({ author: req.user._id }).exec();
      const drafts = await Blog.find({
        author: req.user?._id,
        status: "draft",
      }).exec();

      // Combine user account and articles
      const userWithArticles = { ...userAccount.toObject(), articles, drafts };

      return sendApiResponse(
        res,
        "success",
        userWithArticles, // Return the combined object
        "User found successfully"
      );
    } else {
      return sendApiResponse(res, "error", {}, "Account not found", 401);
    }
  }
);
export const getAuthor = catchAsyncErrors(
  async (req: RequestType, res: Response) => {
    const id = req.params?.authorId;
    if (id) {
      // Fetch user account without password
      const userAccount = await UserAccount.findById(id)
        .select("-password")
        .exec();

      if (!userAccount) {
        return sendApiResponse(res, "error", null, "User not found", 400);
      }

      // Fetch articles for the user
      const articles = await Blog.find({ author: id }).exec();
      const drafts = await Blog.find({
        author: req.user?._id,
        status: "draft",
      }).exec();

      // Combine user account and articles
      const userWithArticles = { ...userAccount.toObject(), articles, drafts };

      return sendApiResponse(
        res,
        "success",
        userWithArticles, // Return the combined object
        "User found successfully"
      );
    } else {
      return sendApiResponse(res, "error", {}, "Account not found", 401);
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
      // res.status(200).json({ message: "User followed successfully" });
      return sendApiResponse(res, "success", user, "You are following.");
    } else {
      return sendApiResponse(res, "error", {}, "User already followed", 400);
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

      return sendApiResponse(
        res,
        "success",
        user,
        "User unfollowed successfully",
        200
      );
    } else {
      return sendApiResponse(res, "error", {}, "User not followed", 400);
    }
  }
);

export const getAllAuthors = catchAsyncErrors(
  async (req: Request, res: Response) => {
    const authors = await UserAccount.find({}).populate("articles");

    return sendApiResponse(
      res,
      "success",
      authors,
      "Authors Found Successfully",
      200
    );
  }
);
