import { RequestType } from "@/constants/AppConstants";
import catchAsyncErrors from "@/middlewares/catchAsyncErrors";
import Upload from "@/middlewares/upload";
import Blog from "@/models/blogs.model";
import Comment from "@/models/comment.model";
import { sendApiResponse } from "@/utils/utils";
import { Response } from "express";
import { BASE_URL } from "./user.controller";
import { type Request } from "express";
// const uploadMiddleware = createUploadMiddleware("thumbnail");

export const createBlogPost = catchAsyncErrors(
  async (req: Request, res: Response) => {
    const { title, content, tags } = req.body;
    console.log("tags", tags);
    const parsedTags = JSON.parse(tags)?.length ? JSON.parse(tags) : [];
    console.log("parsedTags", parsedTags);

    const blogPost = new Blog({
      title,
      content: JSON.parse(content),
      author: req?.user?.id,
      tags: parsedTags,
      thumbnail: BASE_URL + req.fileUpload?.filename || "",
      status: "published",
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

// export const createDraft = catchAsyncErrors(
//   async (req: RequestType, res: Response) => {
//     const { title, content, tags } = req.body;

//     const draftPost = new Blog({
//       title,
//       content,
//       author: req.user?._id,
//       status: "draft",
//       tags,
//       // thumbnail: req.body.thumbnail || "",
//     });

//     await draftPost.save();

//     return sendApiResponse(
//       res,
//       "success",
//       draftPost,
//       "Draft created successfully",
//       201
//     );
//   }
// );

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
    // console.log("request", req);
    console.log("1");
    const blogPosts = await Blog.find({ status: "published" }).populate(
      "author"
    );
    console.log("blogPosts", blogPosts);
    if (blogPosts) {
      // res.json(blogPosts);
      return sendApiResponse(
        res,
        "success",
        blogPosts,
        "Blog Posts Found Successfully",
        200
      );
    }
  }
);
export const getBlogPost = catchAsyncErrors(
  async (req: RequestType, res: Response) => {
    const blogPost = await Blog.findById(req.params.id);
    if (blogPost) {
      res.json(blogPost);
    } else {
      res.status(404).json({ message: "Blog post not found" });
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
  async (req: RequestType, res: Response) => {
    const { content } = req.body;
    const blogPost = await Blog.findById(req.params.id);
    if (blogPost) {
      const comment = new Comment({
        content,
        author: req?.user?.id,
        post: req.params.id,
      });
      await comment.save();
      blogPost.comments.push(comment._id);
      await blogPost.save();
      res.status(201).json(comment);
    } else {
      res.status(404).json({ message: "Blog post not found" });
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
