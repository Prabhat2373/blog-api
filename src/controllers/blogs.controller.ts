import { RequestType } from "@/constants/AppConstants";
import {
  basePaginationOptions,
  formatPaginate,
} from "@/helper/pagination/pagination.helpers";
import catchAsyncErrors from "@/middlewares/catchAsyncErrors";
import BlogCategory from "@/models/blog.categories.model";
import Blog from "@/models/blogs.model";
import Comment from "@/models/comment.model";
import Reply from "@/models/reply.model";
import { sendApiResponse, sendPaginatedApiResponse } from "@/utils/utils";
import { Response, type Request } from "express";
import mongoose from "mongoose";
import { BASE_URL } from "./user.controller";
import UserAccount from "@/models/account.model";
// const uploadMiddleware = createUploadMiddleware("thumbnail");

export const createBlogPost = catchAsyncErrors(
  async (req: Request, res: Response) => {
    const { title, content, tags, scheduledAt } = req.body;
    console.log("tags", tags);
    const parsedTags = JSON.parse(tags)?.length ? JSON.parse(tags) : [];
    console.log("parsedTags", parsedTags);

    const blogPost = new Blog({
      title,
      content: JSON.parse(content),
      author: req?.user?.id,
      tags: parsedTags,
      scheduledAt: scheduledAt ? new Date(scheduledAt) : null,
      thumbnail: BASE_URL + req.fileUpload?.filename || "",
      // status: "published",
      status: scheduledAt ? "scheduled" : "published",
    });
    // console.log("blogPost", blogPost);
    await blogPost.save();
    // res.status(201).json(blogPost);
    return sendApiResponse(
      res,
      "success",
      blogPost,
      "Post Published Successfully!",
      201
    );
  }
);

export const updateBlog = catchAsyncErrors(
  async (req: RequestType, res: Response) => {
    const { title, content, tags } = req.body;
    const id = req?.params?.id;
    const userId = req.user?.id;

    const blogPost = await Blog.findById(id).populate("author");
    const parsedTags = JSON.parse(tags)?.length ? JSON.parse(tags) : [];
    const blogAuthorId = blogPost?.author?._id?.toString();

    console.log("blogPost", blogPost?.author);
    console.log("meta", blogAuthorId, userId);

    if (userId === blogAuthorId) {
      const updatedData = {
        title,
        content: JSON.parse(content),
        tags: parsedTags,
      };
      if (req.fileUpload?.filename) {
        updatedData.thumbnail = BASE_URL + req.fileUpload?.filename;
      }

      const updatedBlog = await blogPost?.updateOne(updatedData, {
        new: true,
      });
      console.log("updatedBlog", updatedBlog);
      return sendApiResponse(
        res,
        "success",
        { _id: id },
        "Post Updated Successfully",
        200
      );
    }
    return sendApiResponse(res, "error", {}, "Only Author can updat blog", 400);
  }
);

export const createOrUpdateDraft = catchAsyncErrors(
  async (req: RequestType, res: Response) => {
    console.log("getting here");
    const { draftId, title, content, tags, thumbnail } = req.body;

    let draftPost;

    console.log("draftId", draftId, !!draftId, typeof draftId);

    if (!!draftId && draftId != "undefined") {
      console.log("updating blog");
      // Update existing draft
      draftPost = await Blog.findByIdAndUpdate(
        { id: draftId },
        { title, content, tags, thumbnail },
        { new: true }
      );
      if (!draftPost) {
        return sendApiResponse(res, "error", null, "Draft not found", 404);
      }
      // draftPost.title = title;
      // draftPost.content = content;
      // draftPost.tags = tags;
      // draftPost.thumbnail = thumbnail || draftPost.thumbnail;
      // draftPost.updatedAt = new Date();
      // await draftPost.save();
    } else {
      // Create new draft
      draftPost = new Blog({
        title,
        content,
        author: req.user?._id,
        status: "draft",
        tags,
        thumbnail: thumbnail || "",
      });
      await draftPost.save();
    }

    return sendApiResponse(
      res,
      "success",
      draftPost,
      draftId ? "Draft updated successfully" : "Draft created successfully",
      201
    );
  }
);
export const updateDraft = catchAsyncErrors(
  async (req: Request, res: Response) => {
    const { id } = req.params;
    const { title, content, tags, thumbnail } = req.body;

    const updatedDraft = await Blog.findByIdAndUpdate(
      id,
      { title, content, tags, thumbnail },
      { new: true }
    );

    if (!updatedDraft) {
      return sendApiResponse(res, "error", null, "Draft not found", 404);
    }

    return sendApiResponse(
      res,
      "success",
      updatedDraft,
      "Draft updated successfully"
    );
  }
);

export const publishDraft = catchAsyncErrors(
  async (req: Request, res: Response) => {
    const { id } = req.params;

    const updatedDraft = await Blog.findByIdAndUpdate(
      id,
      { status: "published" },
      { new: true }
    );

    if (!updatedDraft) {
      return sendApiResponse(res, "error", null, "Draft not found", 404);
    }

    return sendApiResponse(
      res,
      "success",
      updatedDraft,
      "Draft published successfully"
    );
  }
);

export const getUserDrafts = catchAsyncErrors(
  async (req: RequestType, res: Response) => {
    console.log("req", req);
    const drafts = await Blog.find({
      author: req.user?.id,
      status: "draft",
    });

    return sendApiResponse(
      res,
      "success",
      drafts,
      "Drafts retrieved successfully"
    );
  }
);

export const getAllPosts = catchAsyncErrors(
  async (req: RequestType, res: Response) => {
    const limit = req.query?.limit ? Number(req.query?.limit) : 10;
    const page = req.query?.page ? Number(req.query?.page) : 0;
    const status = req.query?.status;
    const query = {};

    const options = basePaginationOptions;
    options.limit = limit;
    options.page = page;
    options.populate = [{ path: "author", model: UserAccount }];
    console.log("options", options);
    query.status = status || "published";

    console.log("1");
    // const blogPosts = await Blog.find({ status: "published" })
    //   .populate("author")
    //   .sort("-createdAt");

    const blogPosts = await Blog.paginate(
      query,
      basePaginationOptions,
      formatPaginate
    );

    console.log("blogPosts", blogPosts);
    if (blogPosts) {
      // res.json(blogPosts);
      return sendPaginatedApiResponse(
        res,
        "success",
        blogPosts,
        "Blog Posts Found Successfully",
        200
      );
    }
  }
);

export const getFollowingPosts = catchAsyncErrors(async (req, res) => {
  const limit = req.query?.limit ? Number(req.query?.limit) : 10;
  const page = req.query?.page ? Number(req.query?.page) : 0;

  if (!req.user?.id) {
    return sendPaginatedApiResponse(
      res,
      "error",
      [],
      "User not authenticated",
      401
    );
  }

  const user = await UserAccount.findById(req.user.id).populate("following");
  if (!user) {
    return sendPaginatedApiResponse(res, "error", [], "User not found", 404);
  }

  const followingAuthorIds = user.following.map((following) => following._id);
  const query = {
    status: "published",
    author: { $in: followingAuthorIds },
  };

  const options = {
    ...basePaginationOptions,
    limit,
    page,
    populate: [{ path: "author", model: UserAccount }],
  };

  const blogPosts = await Blog.paginate(query, options, formatPaginate);

  if (blogPosts) {
    return sendPaginatedApiResponse(
      res,
      "success",
      blogPosts,
      "Blog Posts from Following Authors Found Successfully",
      200
    );
  } else {
    return sendPaginatedApiResponse(
      res,
      "error",
      [],
      "No Blog Posts Found",
      404
    );
  }
});

export const getBlogPost = catchAsyncErrors(
  async (req: RequestType, res: Response) => {
    const blogPost = await Blog.findById(req.params.id).populate("author");
    if (blogPost) {
      const userId = req.user?.id; // Assuming req.user contains the authenticated user's info
      const anonymousIdentifier =
        req.ip || req.headers["x-forwarded-for"] || req.sessionID; // Fallback to IP or session ID for anonymous users

      console.log("anonymousIdentifier", anonymousIdentifier);
      let hasViewed = false;

      if (userId) {
        // Check if the user ID is already in the views array
        hasViewed = blogPost.views.includes(userId);
        if (!hasViewed) {
          blogPost.views.push(new mongoose.Types.ObjectId(userId));
        }
      } else {
        // Check if the anonymous identifier is already in the anonymousViews array
        hasViewed = blogPost.anonymousViews.includes(anonymousIdentifier);
        if (!hasViewed) {
          blogPost.anonymousViews.push(anonymousIdentifier);
        }
      }

      if (!hasViewed) {
        blogPost.viewsCount += 1;
        await blogPost.save();
      }

      // await blogPost.updateOne({ views: updatedViews });
      return sendApiResponse(
        res,
        "success",
        blogPost,
        "Blog post found successfully",
        200
      );
    } else {
      // res.status(404).json({ message: "Blog post not found" });
      return sendApiResponse(res, "error", {}, "Blog post not found", 400);
    }
  }
);

export const likeBlogPost = catchAsyncErrors(
  async (req: RequestType, res: Response) => {
    const blogPost = await Blog.findById(req.params.id);
    if (blogPost && !blogPost.likes.includes(req.user.id)) {
      blogPost.likes.push(req.user.id);
      await blogPost.save();
      res.status(200).json({ message: "Blog post liked" });
    } else {
      res.status(400).json({ message: "Blog post already liked" });
    }
  }
);

export const commentOnBlogPost = catchAsyncErrors(
  async (req: Request, res: Response) => {
    const { content, parentCommentId } = req.body; // Include parentCommentId in the request body
    const blogPost = await Blog.findById(req.params.id);

    if (blogPost) {
      const comment = new Comment({
        content,
        author: req?.user?.id,
        post: req.params.id,
        parent: parentCommentId || null, // Set parent if parentCommentId is provided
      });

      await comment.save();

      if (parentCommentId) {
        const parentComment = await Comment.findById(parentCommentId);
        if (parentComment) {
          parentComment.replies.push(comment._id); // Assuming replies field exists in Comment model
          await parentComment.save();
        } else {
          return sendApiResponse(
            res,
            "error",
            null,
            "Parent comment not found",
            404
          );
        }
      } else {
        blogPost.comments.push(comment._id);
        await blogPost.save();
      }

      return sendApiResponse(
        res,
        "success",
        comment,
        "Comment Posted Successfully",
        200
      );
    } else {
      return sendApiResponse(res, "error", null, "Blog post not found", 404);
    }
  }
);

export const getPostComments = catchAsyncErrors(
  async (req: Request, res: Response) => {
    const postId = req?.params?.id;

    if (postId) {
      const comments = await Comment.find({
        post: postId,
      }).populate("author"); // error on this code only
      console.log("comments", comments);
      return sendApiResponse(
        res,
        "success",
        comments,
        "Comments Found Successfully",
        200
      );
    } else {
      return sendApiResponse(res, "error", null, "Post not found", 404);
    }
  }
);

export const shareBlogPost = catchAsyncErrors(
  async (req: RequestType, res: Response) => {
    const blogPost = await Blog.findById(req.params.id);
    if (blogPost) {
      // Logic for sharing the blog post, e.g., generate a shareable link
      res.status(200).json({ message: "Blog post shared" });
    } else {
      res.status(404).json({ message: "Blog post not found" });
    }
  }
);

export const replyToComment = catchAsyncErrors(
  async (req: RequestType, res: Response) => {
    const { content } = req.body;
    const comment = await Comment.findById(req.params.commentId);
    if (comment) {
      console.log("author", req.user?.id);
      const reply = new Reply({
        content,
        author: req?.user?.id,
        comment: req.params.commentId,
      });
      await reply.save();
      comment.replies.push(reply._id);
      await comment.save();
      return sendApiResponse(
        res,
        "success",
        reply,
        "Reply Posted Successfully",
        200
      );
    } else {
      return sendApiResponse(res, "error", null, "Comment not found", 404);
    }
  }
);

export const getRepliesForComment = catchAsyncErrors(
  async (req: Request, res: Response) => {
    const replies = await Reply.find({
      comment: req.params.commentId,
    }).populate("author"); // Populate author details

    return sendApiResponse(
      res,
      "success",
      replies,
      "Replies fetched successfully",
      200
    );
  }
);

export const deleteComment = catchAsyncErrors(
  async (req: RequestType, res: Response) => {
    const { id } = req.params;
    const userId = req.user?.id;
    const comment = await Comment.findById(id).populate("author");
    console.log("userId", userId, comment?.author);
    if (userId !== comment?.author?._id) {
      return sendApiResponse(res, "error", null, "Forbidden", 400);
    }

    if (comment) {
      await comment.deleteOne();
      // Optionally, delete associated replies
      await Reply.deleteMany({ comment: id });
      return sendApiResponse(
        res,
        "success",
        null,
        "Comment Deleted Successfully",
        200
      );
    } else {
      return sendApiResponse(res, "error", null, "Comment not found", 404);
    }
  }
);

export const deleteReply = catchAsyncErrors(
  async (req: RequestType, res: Response) => {
    const { replyId } = req.params;
    const reply = await Reply.findById(replyId).populate("author");
    const userId = req.user?.id;
    console.log("userId", userId != reply?.author?._id?.toString());
    if (userId != reply?.author?._id) {
      return sendApiResponse(res, "error", null, "Forbidden", 400);
    }

    if (reply) {
      await reply.deleteOne();
      return sendApiResponse(
        res,
        "success",
        null,
        "Reply Deleted Successfully",
        200
      );
    } else {
      return sendApiResponse(res, "error", null, "Reply not found", 404);
    }
  }
);

export const getBlogTopics = catchAsyncErrors(
  async (req: RequestType, res: Response) => {
    // const topics = await BlogCategory.find({})

    const limit = req.query?.limit ? Number(req.query?.limit) : 10;
    const page = req.query?.page ? Number(req.query?.page) : 0;
    const query = {
      limit,
    };

    const options = basePaginationOptions;
    options.limit = limit;
    options.page = page;
    console.log("options", options);
    // options.page = page;

    const topics = await BlogCategory.paginate(query, options, formatPaginate);

    if (topics) {
      return sendPaginatedApiResponse(
        res,
        "success",
        topics,
        "Topics Found Successfully",
        200
      );
    }
  }
);

export const savePost = catchAsyncErrors(
  async (req: RequestType, res: Response) => {
    const userId = req.user.id; // Assuming req.user contains the authenticated user's info
    const postId = req.params.id;

    const post = await Blog.findById(postId);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    if (!post.savedBy.includes(userId)) {
      post.savedBy.push(userId);
      await post.save();

      const user = await UserAccount.findById(userId);
      if (!user.savedPosts.includes(postId)) {
        user.savedPosts.push(postId);
        await user.save();
      }
    }

    return sendApiResponse(res, "success", {}, "Post saved successfully", 200);
  }
);

export const unsavePost = catchAsyncErrors(
  async (req: RequestType, res: Response) => {
    const userId = req.user.id; // Assuming req.user contains the authenticated user's info
    const postId = req.params.id;

    const post = await Blog.findById(postId);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    if (post.savedBy.includes(userId)) {
      post.savedBy = post.savedBy.filter((id) => id.toString() !== userId);
      await post.save();

      const user = await UserAccount.findById(userId);
      if (user.savedPosts.includes(postId)) {
        user.savedPosts = user.savedPosts.filter(
          (id) => id.toString() !== postId
        );
        await user.save();
      }
    }

    return sendApiResponse(
      res,
      "success",
      {},
      "Post unsaved successfully",
      200
    );
  }
);
