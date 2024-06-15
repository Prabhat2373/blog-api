import mongoose, { Document, Schema } from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";

export interface IBlogPost extends Document {
  title: string;
  content: IContent;
  author: mongoose.Types.ObjectId;
  status: "draft" | "published"; // New field

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
  text?: string;
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
  text: { type: String, required: false },
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
    content: { type: JSON, required: true },
    author: { type: Schema.Types.ObjectId, ref: "Account", required: true },
    thumbnail: { type: String, required: false },
    tags: { type: [String], default: [] },
    likes: [{ type: Schema.Types.ObjectId, ref: "Account" }],
    comments: [{ type: Schema.Types.ObjectId, ref: "Comment" }],
    status: { type: String, enum: ["draft", "published"], default: "draft" }, // New field
    // views: { type: Number, required: false },
    savedBy: [{ type: Schema.Types.ObjectId, ref: "Account" }], // Array to store IDs of users who saved the post
    anonymousViews: { type: [String], default: [] }, // Array to store anonymous view identifiers
    views: [{ type: Schema.Types.ObjectId, ref: "Account" }], // Array to store account IDs
    viewsCount: { type: Number, default: 0 }, // Total views count
  },
  { timestamps: true }
);

BlogPostSchema.plugin(mongoosePaginate);
const Blog = mongoose.model<IBlogPost>("Posts", BlogPostSchema);

export default Blog;
