import mongoose from "mongoose";
import BlogCategory from "../models/blog.categories.model";
import { blogCategories } from "../__mocks__/blog.categories.seeder.data";

const blogCategoriesSeeder = async () => {
  try {
    console.log("Running seeder...");

    // Connect to the MongoDB database
    await mongoose.connect("mongodb://127.0.0.1:27017/blog");
    console.log("Connected to database");

    // Remove any existing data from the blog categories collection
    await BlogCategory.deleteMany({});
    console.log("Existing blog categories removed");

    // Log the data to be inserted
    // console.log("Blog categories to be inserted:", blogCategories);

    // Insert the blog categories data into the collection
    const result = await BlogCategory.insertMany(blogCategories);
    // console.log("Blog categories inserted:", result);

    // Disconnect from the database
    await mongoose.disconnect();
    console.log("Disconnected from database");

    console.log("Seeding completed successfully!");
  } catch (error) {
    console.error("Seeding failed:", error);
  }
};

blogCategoriesSeeder();

export default blogCategoriesSeeder;
