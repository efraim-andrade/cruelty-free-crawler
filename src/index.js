const puppeteer = require("puppeteer");

// const generateJsonFile = require("./functions/generateJsonFile");

const BASE_URL = "http://www.pea.org.br/empresas.htm";

(async () => {
  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();
  await page.goto(BASE_URL);

  const commandsList = await page.evaluate(() => {
    const nodeList = document.querySelectorAll(".MsoNormal");

    const listOfBruteBrands = [...nodeList];

    console.log("🚀 ~ commandsList ~ listOfBruteBrands", listOfBruteBrands);

    return listOfBruteBrands;
  });

  // generateJsonFile({
  //   fileName: "commands-list",
  //   fileContent: commandListWithInfo,
  // });

  await browser.close();
})();
