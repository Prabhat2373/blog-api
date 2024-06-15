import mongoose, { Schema, Document } from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";

interface IBlogCategory extends Document {
  label: string;
  value: string;
}

const BlogCategorySchema: Schema = new Schema({
  label: { type: String, required: true },
  value: { type: String, required: true },
});

BlogCategorySchema.plugin(mongoosePaginate);

const BlogCategory = mongoose.model<IBlogCategory>(
  "BlogCategory",
  BlogCategorySchema
);

export default BlogCategory;
