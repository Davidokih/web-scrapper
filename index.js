const puppeteer = require('puppeteer');
const fs = require('fs');
const Parser = require('json2csv').Parser;

const run_web_scrapper = async () => {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto('https://www.traversymedia.com/');

    // await page.screenshot({ path: 'example.png', fullPage: true });
    // const html = await page.content();

    const scrappedData = await page.evaluate(() => {
        const products = [];
        const elements = document.querySelectorAll('.cscourse-grid .card');
        elements.forEach(e => {
            const level = e.querySelector('.card-body .level').innerText;
            const title = e.querySelector('.card-body h3').innerText;
            const url = e.querySelector('.card-footer a').href;

            products.push({ level, title, url });
        });
        return products;
    });
    // const scrappedData = await page.$$eval('.cscourse-grid .card', (elements) => elements.map(e => ({
    //     level: e.querySelector('.card-body .level').innerText,
    //     title: e.querySelector('.card-body h3').innerText,
    //     url: e.querySelector('.card-footer a').href
    // })));
    // console.log(scrappedData);
    // const jsonData = JSON.stringify(scrappedData);
    // console.log(jsonData);

    const csvParser = new Parser();
    const csv = csvParser.parse(scrappedData);

    fs.writeFile('products.csv', csv, (err) => {
        if (err) throw err;
        console.log('File Saved');
    });
    // console.log(csv);
    // console.log('Data scrapped and saved to products.csv');
    await browser.close();
};

run_web_scrapper();