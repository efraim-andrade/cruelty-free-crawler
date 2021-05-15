const puppeteer = require("puppeteer");

const generateJsonFile = require("./functions/generateJsonFile");

const BASE_URL = "http://www.pea.org.br/empresas.htm";

const HTML_TAG_REGEX = /(<([^>]+)>)/gi;
const UNNECESSARY_WHITESPACE = /\s\s+/g;
const ALL_BEFORE_TWO_DOTS = /^[^:\r\n]+:\h*/gi;

(async () => {
  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();
  await page.goto(BASE_URL);

  const brandList = await page.evaluate(() => {
    const amountOfHTMLCrapWithBrands = document.querySelectorAll("font");

    const listOfBruteBrands = [...amountOfHTMLCrapWithBrands];

    let listOfGroupedBrands = [];

    const brands = listOfBruteBrands
      .map((brand) => brand.innerHTML)
      .filter((brand) => brand.includes("Marcas:"))
      .map((brand) =>
        brand
          .replace(UNNECESSARY_WHITESPACE, "")
          .replace(HTML_TAG_REGEX, "")
          .replace(ALL_BEFORE_TWO_DOTS, "")
          .replace(/Marcas:/g, "")
          .replace(/&nbsp/g, "")
      )
      .filter((brand) => !!brand);

    brands.forEach((brand) => {
      brand.split(",").forEach((byComma) => {
        byComma.split(":").forEach((byComma) => {
          listOfGroupedBrands.push(byComma.split(";"));
        });
      });
    });

    const finalBrandList = listOfGroupedBrands
      .flat()
      .map((brand) => brand.trim())
      .filter((brand) => !!brand);

    return finalBrandList;
  });

  generateJsonFile({
    fileName: "cruelty-free-brand-list",
    fileContent: brandList,
  });

  await browser.close();
})();
