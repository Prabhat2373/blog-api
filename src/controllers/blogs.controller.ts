import { RequestType } from "@/constants/AppConstants";
import catchAsyncErrors from "@/middlewares/catchAsyncErrors";
import Upload, { createUploadMiddleware } from "@/middlewares/upload";
import Blog from "@/models/blogs.model";
import Comment from "@/models/comment.model";
import { sendApiResponse } from "@/utils/utils";
import { Response } from "express";
import { BASE_URL } from "./user.controller";
const uploadMiddleware = createUploadMiddleware("thumbnail");

export const createBlogPost = catchAsyncErrors(
  async (req: RequestType, res: Response) => {
    // await uploadMiddleware(req, res);
    await Upload(req, res);
    const { title, content, tags } = req.body;

    // console.log("file", req?.files);
    const blogPost = new Blog({
      title,
      content: JSON.parse(content),
      author: req?.user?.id,
      tags,
      // thumbnail:
      //   req.files && req.files?.length ? BASE_URL + req.files[0].filename : "",
    });
    // console.log("blogPost", blogPost);
    await blogPost.save();
    res.status(201).json(blogPost);
  }
);

export const getAllPosts = catchAsyncErrors(
  async (req: RequestType, res: Response) => {
    console.log("request", req);
    console.log("1");
    const blogPosts = await Blog.find({}).populate("author");
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
