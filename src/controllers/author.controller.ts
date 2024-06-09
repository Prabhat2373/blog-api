import { RequestType, responseType } from "@/constants/AppConstants";
import catchAsyncErrors from "@/middlewares/catchAsyncErrors";
import Blog from "@/models/blogs.model";
import { sendApiResponse } from "@/utils/utils";
import { type Response } from "express";

export const getAuthorPosts = catchAsyncErrors(
  async (req: RequestType, res: Response) => {
    const authorId = req.params?.id;
    const authorPublishedPosts = await Blog.find({
      author: authorId,
      status: "published",
    });

    return sendApiResponse(
      res,
      "success",
      authorPublishedPosts,
      "Posts found successfully",
      200
    );
  }
);
