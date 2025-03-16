// This script will run the Prisma migrations and seed the database
// It's for demonstration purposes only

const { execSync } = require("child_process")

try {
  console.log("Setting up the database...")

  // Generate Prisma client
  console.log("Generating Prisma client...")
  execSync("npx prisma generate", { stdio: "inherit" })

  // Push the schema to the database
  console.log("Pushing schema to database...")
  execSync("npx prisma db push", { stdio: "inherit" })

  // Seed the database by calling our API endpoint
  console.log("Seeding the database...")

  // In a real scenario, you would make an HTTP request to your API endpoint
  // For this demo, we'll just show what would happen
  console.log("POST request to /api/seed would create:")
  console.log('- Event "Emma & James" with 6 tables')
  console.log('- Event "Sophia & Michael" with 6 tables')
  console.log("- Various family entries assigned to tables")

  console.log("\nDatabase setup complete!")
  console.log("\nTo seed the database in your deployed app, make a POST request to:")
  console.log("/api/seed")
} catch (error) {
  console.error("Error setting up database:", error)
  process.exit(1)
}

