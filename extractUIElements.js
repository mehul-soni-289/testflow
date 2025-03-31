const { chromium } = require("playwright");

/**
 * Extract UI Elements from the Webpage
 * @returns {Array} - [{ id, type, label }]
 */
async function extractUIElements() {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();

  await page.goto("http://127.0.0.1:3000/index.html"); // Change to your webpage

  // Extract UI elements
  const uiComponents = await page.evaluate(() => {
    const elements = [];

    // Handle Inputs (text, email, password, etc.)
    document.querySelectorAll("input, textarea, select").forEach((el) => {
      elements.push({
        id: el.id || null,
        type: el.tagName.toLowerCase(),
        label: el.placeholder || el.getAttribute("aria-label") || null,
      });
    });

    // Handle Buttons
    document.querySelectorAll("button").forEach((el) => {
      elements.push({
        id: el.id || null,
        type: "button",
        label: el.innerText.trim() || el.getAttribute("aria-label") || null,
      });
    });

    // Handle Links
    document.querySelectorAll("a").forEach((el) => {
      elements.push({
        id: el.id || null,
        type: "link",
        label: el.innerText.trim() || el.getAttribute("aria-label") || null,
      });
    });

    return elements;
  });

  await browser.close();
  console.log(uiComponents);

  return uiComponents;
}
module.exports = { extractUIElements };
