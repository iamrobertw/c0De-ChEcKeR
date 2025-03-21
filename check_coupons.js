/**
 * Automated Coupon Code Checker
 *
 * This script uses Puppeteer to automate the testing of a list of coupon codes on the target website.
 * It enters each coupon code into the input field, clicks the apply button, and verifies if the success
 * message ("Zastosowano kod rabatowy") appears on the page.
 *
 * Valid coupon codes are then saved to valid_codes.txt.
 *
 * Usage:
 *   node check_coupons.js
 */

require("dotenv").config();
const puppeteer = require("puppeteer");
const fs = require("fs");

// Load the environment variables
const url = process.env.URL;
const codes = process.env.CODES.split(",");
/**
 * sleep: Helper function to delay execution for a given number of milliseconds.
 * @param {number} ms - Milliseconds to wait.
 * @returns {Promise} A promise that resolves after the specified time.
 */
async function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * checkCoupons: Main function to test each coupon code.
 * Navigates to the website, enters the coupon code, applies it, and checks for the success message.
 */
async function checkCoupons() {
  console.log("Starting coupon code check...");

  const browser = await puppeteer.launch({ headless: false, slowMo: 100 });
  //   const browser = await puppeteer.launch({ headless: true }); //? OPTIONAL - run in headless mode. Without browser UI.
  const page = await browser.newPage();
  page.setDefaultTimeout(60000);

  // Navigate to the target URL and wait until the network is idle.
  await page.goto(url, { waitUntil: "networkidle2" });

  const validCodes = [];

  // Process each coupon code from the list.
  for (const code of codes) {
    try {
      console.log(`\nTesting code: ${code}`);
      // Wait for the coupon input field (identified by its placeholder).
      await page.waitForSelector('input[placeholder="Wpisz kod rabatowy"]', {
        timeout: 30000,
      });

      // Clear the input field by selecting all text and deleting it.
      await page.click('input[placeholder="Wpisz kod rabatowy"]', {
        clickCount: 3,
      });
      await page.keyboard.press("Backspace");

      // Type the coupon code into the input field.
      await page.type('input[placeholder="Wpisz kod rabatowy"]', code);

      // Click the apply button (assuming it's the only button on the page).
      await page.waitForSelector("button", { timeout: 5000 });
      await page.click("button");

      // Wait a few seconds to allow the success/failure message to appear.
      await sleep(3000);

      // Retrieve the full text of the page.
      const pageText = await page.evaluate(() => document.body.innerText);

      // Check for the expected success message.
      if (pageText.includes("Zastosowano kod rabatowy")) {
        console.log(`Kod ${code} jest prawidłowy.`);
        validCodes.push(code);
      } else {
        console.log(`Kod ${code} nie działa.`);
      }
    } catch (error) {
      console.log(`Błąd przy sprawdzaniu kodu ${code}: ${error.message}`);
    }
  }

  // Write valid codes to a file.
  fs.writeFileSync("valid_codes.txt", validCodes.join("\n"));
  console.log("\nPrawidłowe kody zapisane do valid_codes.txt");

  await browser.close();
}

// Execute the coupon checking function and catch any unhandled errors.
checkCoupons().catch((error) => console.error("Unhandled error:", error));
