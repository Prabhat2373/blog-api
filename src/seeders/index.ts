// seeders/index.ts
import * as fs from "fs";
import * as path from "path";

function seedAllSeeders() {
  const seedersPath = path.join(__dirname, "/");
  const seederFiles = fs
    .readdirSync(seedersPath)
    .filter((file) => file.endsWith("Seeder.ts" || "seeder.ts"));

  seederFiles.forEach((file) => {
    const seederPath = path.join(seedersPath, file);
    require(seederPath); // Execute or import your seeder logic
  });
}

function seedSpecificSeeder(seederName: string) {
  console.log("seederName", seederName);

  //   const seederPath = path.join(__dirname, `${seederName}Seeder.ts`);

  //   require(seederPath); // Execute or import your specific seeder logic
  const seederPath = path.join(__dirname, `${seederName}Seeder.ts`);

  try {
    require(seederPath); // Execute or import your specific seeder logic
  } catch (error) {
    console.error(`Seeder ${seederName} not found.`);
  }
}

if (process.argv.includes("--name")) {
  // Seed specific seeder by name
  //   const seederNameIndex = process.argv.indexOf("--name") + 1;
  //   const seederName = process.argv[seederNameIndex];

  //   seedSpecificSeeder(seederName);
  // Seed specific seeder by name
  console.log("argument", process.argv);

  const seederNameIndex = process.argv.indexOf("--name") + 1;
  console.log("seederNameIndex", seederNameIndex, process.argv);

  const seederName = process.argv[seederNameIndex];
  console.log("seederName", seederName);

  seedSpecificSeeder(seederName);
} else {
  // Seed all seeders
  seedAllSeeders();
}
