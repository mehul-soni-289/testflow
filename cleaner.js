const fs = require("fs");

// Read the Playwright test file
let code = fs.readFileSync("generatedTests.spec.js", "utf8");

// Split into lines
let lines = code.trim().split("\n");

// Remove the first and last line
if (lines.length > 2) {
  lines = lines.slice(1, -1);
}

// Join back into a string
let cleanedCode = lines.join("\n");

// Write back the cleaned file
fs.writeFileSync("generatedTests.spec.js", cleanedCode);

console.log("✅ First and last lines removed successfully.");
