import mongoose, { Document, Schema } from "mongoose";

export interface IBlogPost extends Document {
  title: string;
  content: IContent;
  author: mongoose.Types.ObjectId;

  createdAt: Date;
  tags: string[];
  likes: mongoose.Types.ObjectId[];
  comments: mongoose.Types.ObjectId[];
  updatedAt: Date;
}

export interface IContent {
  type: string;
  content: Content[];
}

export interface Content {
  type: string;
  attrs: Attrs;
  content: Content2[];
}

export interface Attrs {
  textAlign: string;
}

export interface Content2 {
  type: string;
  marks: Mark[];
  text: string;
}

export interface Mark {
  type: string;
}

const MarkSchema: Schema = new Schema({
  type: { type: String, required: true },
});

const Content2Schema: Schema = new Schema({
  type: { type: String, required: true },
  marks: { type: [MarkSchema], required: true },
  text: { type: String, required: true },
});

const AttrsSchema: Schema = new Schema({
  textAlign: { type: String, required: true },
});

const ContentSchema: Schema = new Schema({
  type: { type: String, required: true },
  attrs: { type: AttrsSchema, required: true },
  content: { type: [Content2Schema], required: true },
});

const FinalContentSchema: Schema = new Schema({
  type: { type: String, required: true },
  content: { type: [ContentSchema], required: true },
});

const BlogPostSchema: Schema = new Schema(
  {
    title: { type: String, required: true },
    content: { type: FinalContentSchema, required: true },
    author: { type: Schema.Types.ObjectId, ref: "account", required: true },
    thumbnail: { type: String, required: false },
    tags: { type: [String], default: [] },
    likes: [{ type: Schema.Types.ObjectId, ref: "account" }],
    comments: [{ type: Schema.Types.ObjectId, ref: "Comment" }],
  },
  { timestamps: true }
);

const Blog = mongoose.model<IBlogPost>("Posts", BlogPostSchema);

export default Blog;
