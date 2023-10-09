import express, { Router } from "express";
import puppeteer from "puppeteer-extra";
import cors from "cors";
import RecaptchaPlugin from "puppeteer-extra-plugin-recaptcha";
import serverless from "serverless-http";

const api = express();
api.use(cors());
api.use(express.json());

puppeteer.use(
  RecaptchaPlugin({
    provider: {
      id: "2captcha",
      token: "204a6beff1c3815ef516b5f5cc4c054e",
    },
  })
);

const router = Router();
router.post("/.netlify/functions/api/profiles", async (req, res) => {
  try {
    const { firstName, lastName, userState } = req.body;

    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto("https://www.truthrecord.org/opt_out/name/landing_page/");

    await page.waitForSelector("#firstName");

    await page.type("#firstName", firstName);
    await page.type("#lastName", lastName);
    await page.select("select#state", userState);
    await Promise.all([
      page.click("#landing > div > div > div > div > div > button"),
      page.waitForNavigation({ waitUntil: "networkidle2" }),
    ]);

    // Click on all 'a' tags with the text "Load more..." until no more exist
    while (true) {
      const clicked = await page.evaluate(() => {
        let elements = Array.from(document.querySelectorAll("a"));
        let element = elements.find(
          (element) => element.textContent === "Load more..."
        );
        if (element) {
          element.click();
          return true;
        }
        return false;
      });

      if (!clicked) {
        break;
      }

      // Wait for the page to load after each click
      await new Promise((r) => setTimeout(r, 100));
    }

    while (true) {
      const clicked = await page.evaluate(() => {
        let elements = Array.from(document.querySelectorAll("a"));
        let element = elements.find(
          (element) => element.textContent === " See More + "
        );
        if (element) {
          element.click();
          return true;
        }
        return false;
      });

      if (!clicked) {
        break;
      }

      // Wait for the page to load after each click
      await new Promise((r) => setTimeout(r, 100));
    }

    const liTextContent = await page.evaluate(() => {
      const liElements = document.querySelectorAll(
        "#search-result > div > div > div.row.results-list > ul > li"
      ); // Adjust the selector to match your HTML structure
      const liText = [];

      liElements.forEach((li) => {
        liText.push(li.textContent);
      });

      return liText;
    });

    await browser.close();

    // Send the scraped data as JSON response
    res.json({ scrapedData: liTextContent });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "An error occurred during scraping." });
  }
});

router.post("/.netlify/functions/api/remove-profile", async (req, res) => {
  try {
    const { firstName, lastName, userState, profile_index } = req.body;

    const browser = await puppeteer.launch({ headless: "new" });
    const page = await browser.newPage();
    await page.goto("https://www.truthrecord.org/opt_out/name/landing_page/");

    // wait for firstName input to load
    await page.waitForSelector("#firstName");

    await page.type("#firstName", firstName);
    await page.type("#lastName", lastName);
    await page.select("select#state", userState);
    await Promise.all([
      page.click("#landing > div > div > div > div > div > button"),
      page.waitForNavigation({ waitUntil: "networkidle2" }),
    ]);

    // Click on all 'a' tags with the text "Load more..." until no more exist
    while (true) {
      const clicked = await page.evaluate(() => {
        let elements = Array.from(document.querySelectorAll("a"));
        let element = elements.find(
          (element) => element.textContent === "Load more..."
        );
        if (element) {
          element.click();
          return true;
        }
        return false;
      });

      if (!clicked) {
        break;
      }

      // Wait for the page to load after each click
      await new Promise((r) => setTimeout(r, 100));
    }

    console.log("profile index", profile_index);
    console.log(page.url());
    await page.waitForSelector("#search-result");

    await Promise.all([
      page.$eval(
        `#search-result > div > div > div.row.results-list > ul > li:nth-child(${
          (profile_index + 1) * 2
        }) > a > div:last-child > button`,
        (el) => el.click()
      ),
      page.waitForNavigation({ waitUntil: "networkidle2" }),
    ]);

    console.log(page.url());

    // wait for 2 seconds
    await page.waitForTimeout(2000);

    await page.type("#emailAddress", "nayeem3156@gmail.com");
    await page.type("#fullName", `${firstName} ${lastName}`);
    await page.type("#address", "652 Cory Street");
    await page.type("#phoneNumber", "347 214 3455");
    await page.solveRecaptchas();

    console.log("solving captcha done");
    await Promise.all([
      page.click(
        "#infoInput > div > div > div > div:nth-child(2) > div > div > div.col-md-8.content-box > div > div > div.text-center > button"
      ),
      page.waitForNavigation({ waitUntil: "networkidle2" }),
    ]);

    await browser.close();

    // Send the scraped data as JSON response
    res.json({ newURL: page.url() });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ error: "An error occurred during scraping this profile." });
  }
});

api.use("/api/", router);

export const handler = serverless(api);
