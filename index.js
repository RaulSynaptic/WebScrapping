const express = require('express')
const app = express()
const puppeteer = require('puppeteer');


const xd = async () => {
    const browser = await puppeteer.launch({
      headless: true,
      devtools: true,
      args: ['--no-sandbox','--disable-setuid-sandbox']
    });
    const page = await browser.newPage();
    
    await page.goto('https://www.autopia.cl/vehiculos?transmision=Mec%C3%A1nico');
    
    // Wait for the results page to load and display the results.
    const resultsSelector = '.ant-spin-container .ant-list-item';
    await page.waitForSelector(resultsSelector);
    
    // Extract the results from the page.
    const links = await page.evaluate(resultsSelector => {
      const items = [...document.querySelectorAll(resultsSelector)].map(anchor => {
        const title = anchor.querySelector('.pcv-p-marca-modelo-anio').innerText;
        const price = anchor.querySelector('.pcv-mostrar-contado').innerText;
        return {
          title,
          price
        }
      });
      return items
    }, resultsSelector);
    
    // Print all the files.
    console.log(links);
    await browser.close();
    return links
  };
  app.get('/', async function (req, res) {
    let links = await xd()
    res.send(links)
  })
  
  app.listen(3000, () => {
    console.log('Servidor arriba!')
  })
  

