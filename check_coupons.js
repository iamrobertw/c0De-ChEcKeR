require("dotenv").config();
const puppeteer = require("puppeteer");
const fs = require("fs");

const url = process.env.URL;
const codes = process.env.CODES.split(",");

async function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function checkCoupons() {
  console.log("Starting coupon code check...");

  const browser = await puppeteer.launch({ headless: false, slowMo: 100 });
  const page = await browser.newPage();
  page.setDefaultTimeout(60000);

  await page.goto(url, { waitUntil: "networkidle2" });

  const validCodes = [];

  for (const code of codes) {
    try {
      console.log(`\nTesting code: ${code}`);
      await page.waitForSelector('input[placeholder="Wpisz kod rabatowy"]', {
        timeout: 30000,
      });

      await page.click('input[placeholder="Wpisz kod rabatowy"]', {
        clickCount: 3,
      });
      await page.keyboard.press("Backspace");

      await page.type('input[placeholder="Wpisz kod rabatowy"]', code);

      await page.waitForSelector("button", { timeout: 5000 });
      await page.click("button");

      await sleep(3000);

      const pageText = await page.evaluate(() => document.body.innerText);

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

  fs.writeFileSync("valid_codes.txt", validCodes.join("\n"));
  console.log("\nPrawidłowe kody zapisane do valid_codes.txt");

  await browser.close();
}

checkCoupons().catch((error) => console.error("Unhandled error:", error));
