import mongoose, { Document, Schema } from "mongoose";

export interface IBlogPost extends Document {
  title: string;
  content: string;
  author: mongoose.Types.ObjectId;

  createdAt: Date;
  tags: string[];
  likes: mongoose.Types.ObjectId[];
  comments: mongoose.Types.ObjectId[];
  updatedAt: Date;
}

const BlogPostSchema: Schema = new Schema(
  {
    title: { type: String, required: true },
    content: { type: String, required: true },
    author: { type: Schema.Types.ObjectId, ref: "account", required: true },

    tags: { type: [String], default: [] },
    likes: [{ type: Schema.Types.ObjectId, ref: "account" }],
    comments: [{ type: Schema.Types.ObjectId, ref: "Comment" }],
  },
  { timestamps: true }
);

const Blog = mongoose.model<IBlogPost>("BlogPost", BlogPostSchema);

export default Blog;
