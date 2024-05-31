import mongoose, { Document, Schema } from "mongoose";

export interface IComment extends Document {
  content: string;
  author: mongoose.Types.ObjectId;
  post: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
  parent: mongoose.Types.ObjectId;
  replies: [mongoose.Types.ObjectId];
}

// const CommentSchema: Schema = new Schema(
//   {
//     content: { type: String, required: true },
//     author: { type: Schema.Types.ObjectId, ref: "User", required: true },
//     post: { type: Schema.Types.ObjectId, ref: "BlogPost", required: true },
//   },
//   { timestamps: true }
// );

const CommentSchema: Schema = new Schema(
  {
    content: { type: String, required: true },
    author: { type: Schema.Types.ObjectId, ref: "Account", required: true },
    post: { type: Schema.Types.ObjectId, ref: "Posts", required: true },
    parent: { type: Schema.Types.ObjectId, ref: "Comment", default: null },
    replies: [{ type: Schema.Types.ObjectId, ref: "Comment" }], // Add replies field
  },
  { timestamps: true }
);

const Comment = mongoose.model<IComment>("Comment", CommentSchema);

export default Comment;
