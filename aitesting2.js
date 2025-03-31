require("dotenv").config();
const { GoogleGenerativeAI } = require("@google/generative-ai");
const fs = require("fs");
const { extractUIElements } = require("./extractUIElements");

// Load environment variables
if (!process.env.GOOGLE_GEMINI_API_KEY) {
  console.error(
    "❌ GOOGLE_GEMINI_API_KEY is not set. Please check your .env file."
  );
  process.exit(1);
}

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GEMINI_API_KEY);

/**
 * Generate Playwright test cases dynamically based on extracted UI elements
 * @param {string} url - The URL of the webpage to test
 */
async function generateTestCases(url) {
  try {
    if (!url) {
      throw new Error("❌ No URL provided. Please pass a valid URL.");
    }

    console.log(`🔍 Extracting UI elements from: ${url}`);
    const uiComponents = await extractUIElements(url);

    if (!uiComponents || uiComponents.length === 0) {
      throw new Error(
        "❌ UI Components extraction failed or returned empty data."
      );
    }

    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    // **Determine test cases dynamically based on UI components**
    const testTypes = [];
    const componentTypes = new Set(
      uiComponents.map((el) => el.type.toLowerCase())
    );

    if (componentTypes.has("input") || componentTypes.has("textarea")) {
      testTypes.push("1️⃣ Input validation (valid & invalid data)");
      testTypes.push("2️⃣ Required fields check");
    }
    if (componentTypes.has("button")) {
      testTypes.push("3️⃣ Button clicks & interactions");
    }
    if (componentTypes.has("link")) {
      testTypes.push("4️⃣ Navigation and redirections");
    }
    if (componentTypes.has("form")) {
      testTypes.push("5️⃣ Form submission & error handling");
    }
    testTypes.push("6️⃣ UI element visibility & accessibility");

    let prompt = `Generate **Playwright test cases** for ${url} based on its UI elements. 

`;
    uiComponents.forEach((el, index) => {
      prompt += `${index + 1}. **${el.type.toUpperCase()}** - ${
        el.label || "No Label"
      } (ID: ${el.id || "No ID"})\n`;
    });

    prompt +=
      `\nInclude the following test cases:\n- ` + testTypes.join("\n- ") + `\n`;
    prompt +=
      "Output only JavaScript Playwright code. No explanations, comments, or documentation.";

    console.log("🧠 Generating AI-based test cases...");
    const response = await model.generateContent(prompt);
    const testCases = response.response.candidates[0].content.parts[0].text;

    console.log("✅ Generated Test Cases:\n", testCases);
    fs.writeFileSync("generatedTests.spec.js", testCases);
    console.log("✅ Test cases saved in generatedTests.spec.js");

    return testCases;
  } catch (error) {
    console.error("❌ Error generating test cases:", error);
  }
}

const testUrl = "http://127.0.0.1:3000/index.html";
if (!testUrl) {
  console.error("❌ Please provide a URL as an argument.");
  process.exit(1);
}

generateTestCases(testUrl);

module.exports = { generateTestCases };