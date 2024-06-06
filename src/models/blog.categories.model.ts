import mongoose, { Schema, Document } from "mongoose";

interface IBlogCategory extends Document {
  label: string;
  value: string;
}

const BlogCategorySchema: Schema = new Schema({
  label: { type: String, required: true },
  value: { type: String, required: true },
});

const BlogCategory = mongoose.model<IBlogCategory>(
  "BlogCategory",
  BlogCategorySchema
);
export default BlogCategory;
