#!/usr/bin/env node

import fs from "fs";
import path from "path";
import { execSync } from "child_process";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log("🚀 Setting up Wedding Commerce Frontend...\n");

// Check if Node.js version is compatible
const nodeVersion = process.version;
const majorVersion = parseInt(nodeVersion.slice(1).split(".")[0]);

if (majorVersion < 18) {
  console.error(
    "❌ Node.js version 18+ is required. Current version:",
    nodeVersion
  );
  process.exit(1);
}

console.log("✅ Node.js version:", nodeVersion);

// Check if .env file exists
const envPath = path.join(__dirname, ".env");
const envTemplatePath = path.join(__dirname, "env.template");

if (!fs.existsSync(envPath)) {
  console.log("📝 Creating .env file...");

  let envContent;
  if (fs.existsSync(envTemplatePath)) {
    // Use template file if exists
    envContent = fs.readFileSync(envTemplatePath, "utf8");
  } else {
    // Fallback content
    envContent = `# API Configuration
VITE_API_URL=http://localhost:8080/api/v1

# Development Configuration
VITE_APP_NAME="Wedding Commerce"
VITE_APP_ENV=development

# Optional: Enable debug mode
VITE_DEBUG=true

# Optional: Feature flags
VITE_ENABLE_ANALYTICS=false
VITE_ENABLE_DEBUG_TOOLS=false
`;
  }

  fs.writeFileSync(envPath, envContent);
  console.log("✅ .env file created");
} else {
  console.log("✅ .env file already exists");
}

// Check if backend is running
console.log("🔍 Checking backend connection...");
try {
  execSync("curl -s http://localhost:8080/api/v1 > /dev/null 2>&1", {
    stdio: "pipe",
  });
  console.log("✅ Backend is running");
} catch (error) {
  console.log("⚠️  Backend is not running. Please start the backend first:");
  console.log("   go run . serve");
}

console.log("\n🎉 Setup completed successfully!");
console.log("\nNext steps:");
console.log("1. Make sure backend is running: go run . serve");
console.log("2. Start frontend development server: npm run dev");
console.log("3. Open http://localhost:5173 in your browser");
console.log("\nHappy coding! 🚀");
