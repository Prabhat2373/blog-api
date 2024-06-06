import { blogCategories } from "../__mocks__/blog.categories.seeder.data";
import BlogCategory from "../models/blog.categories.model";
import mongoose from "mongoose";
// import BlogCategory from "@/models/blogCategory.model";
// import { blogCategories } from "@/data/blogCategories"; // Import the blog categories data

// Function to seed the blog categories collection
const blogCategoriesSeeder = async () => {
  try {
    console.log("Running seeder...");
    // Connect to the MongoDB database
    await mongoose.connect("mongodb://127.0.0.1:27017/blog");

    // Remove any existing data from the blog categories collection
    await BlogCategory.deleteMany({});

    // Insert the blog categories data into the collection
    await BlogCategory.insertMany(blogCategories);

    // Disconnect from the database
    await mongoose.disconnect();

    console.log("Seeding completed successfully!");
  } catch (error) {
    console.error("Seeding failed:", error);
  }
};

// Call the seeding function
blogCategoriesSeeder();

export default blogCategoriesSeeder;
