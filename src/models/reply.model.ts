import mongoose, { Document, Schema } from "mongoose";

export interface IReply extends Document {
  content: string;
  author: mongoose.Types.ObjectId;
  comment: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const ReplySchema: Schema = new Schema(
  {
    content: { type: String, required: true },
    author: { type: Schema.Types.ObjectId, ref: "Account", required: true },
    comment: { type: Schema.Types.ObjectId, ref: "Comment", required: true },
  },
  { timestamps: true }
);

const Reply = mongoose.model<IReply>("Reply", ReplySchema);

export default Reply;
