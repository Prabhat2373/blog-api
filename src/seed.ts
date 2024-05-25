import mongoose from "mongoose";
import skillsSeeder from "./seeders/skillsSeeder";

// Connect to your database
// mongoose.connect(process.env.MONGO_URI);

// Run all seeders
async function runSeeders() {
  try {
    console.log("starting seeders");
    await skillsSeeder(); // Run your seeders
    console.log("All seeders executed successfully.");
  } catch (error) {
    console.error("Error running seeders:", error);
  } finally {
    // mongoose.disconnect(); // Disconnect from the database
  }
}

runSeeders();
