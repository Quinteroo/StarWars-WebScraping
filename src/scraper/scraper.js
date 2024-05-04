const puppeteer = require("puppeteer");
const fs = require("fs")
const dataModel = require("../api/models/data.js")
const { connectDB } = require("../config/connectDB.js")



const scraper = async (url) => {

  try {
    // Navegador
    const browser = await puppeteer.launch({
      headless: false,
      defaultViewport: null,
      args: ['--start-maximized']
    });
    const page = await browser.newPage();
    await page.goto(url, { timeout: 60000 });
    await page.waitForSelector("div.links-footer-copyright");



    // No tiene cookies


    // Show more automatizado
    await page.waitForSelector("div.show_more_container > a.show_more");
    let buttonShowMore = await page.$("a.show_more");
    let isShowMore = true

    while (isShowMore) {
      try {
        await new Promise(resolve => setTimeout(resolve, 1000));
        await buttonShowMore.click();
      } catch (error) {
        isShowMore = false
      }
    }


    // Selección info
    const infoArr = [];
    const infoLi = await page.$$("li.building-block-config");

    for (let i = 0; i < infoLi.length; i++) {
      const li = infoLi[i]
      const img = await li.$eval("img.thumb.reserved-ratio", (e) => e.getAttribute('data-src'))
      const name = await li.$eval("span.long-title", (e) => e.textContent.trim())

      let data = {
        img,
        name
      }

      infoArr.push(data)
    }



    // almacenar en BBDD
    for (const character of infoArr) {
      try {
        await dataModel.create(character);
        console.log(`✔ Se ha guardado correctamente ${character.name} en la BBDD`);
        await new Promise(resolve => setTimeout(resolve, 1000));
      } catch (error) {
        console.log(`✖ Error al guardar ${character.name} en la BBDD`);
        console.error(error);
      }
    }


    // almacenar en archivo .json
    fs.writeFile("./characters.json", JSON.stringify(infoArr), () => {
      console.log("✅ Datos escritos en el archivo characters.json");
    })


    // cerrar navegador
    browser.close()

  } catch (error) {
    console.error("❌ Error en la función Scraper:", error);
  }
};

module.exports = scraper 