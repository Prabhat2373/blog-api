import { RequestType } from "@/constants/AppConstants";
import catchAsyncErrors from "@/middlewares/catchAsyncErrors";
import Blog from "@/models/blogs.model";
import Comment from "@/models/comment.model";
import { Response } from "express";

export const createBlogPost = catchAsyncErrors(
  async (req: RequestType, res: Response) => {
    const { title, content, tags } = req.body;
    const blogPost = new Blog({
      title,
      content,
      author: req?.user?.id,
      tags,
    });
    await blogPost.save();
    res.status(201).json(blogPost);
  }
);

export const getBlogPost = catchAsyncErrors(
  async (req: RequestType, res: Response) => {
    const blogPost = await Blog.findById(req.params.id).populate(
      "author"
      // "comments"
    );
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
