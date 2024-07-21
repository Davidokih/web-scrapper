const puppeteer = require('puppeteer');
const fs = require('fs');
const Parser = require('json2csv').Parser;


const run_web_scrapper = async () => {

    try {
        const browser = await puppeteer.launch();
        const page = await browser.newPage();
        await page.goto('https://scholarship-positions.com/amr-advocacy-photo-contest/2023/11/03/');
        // await page.waitForSelector('.region');

        // await page.screenshot({ path: 'example.png', fullPage: true });
        // const html = await page.content();

        const scrapedData = [];
        const title = await page.$eval('h1', (el => el.textContent));
        console.log(title);
        const about = await page.evaluate(() => document.querySelector('.entry-content').innerText);
        console.log(about);
        const applyUrl = await page.$eval('.entry-content h2 a', (el => el.href));
        console.log(applyUrl);
        // const filteredContent = content.replace(header, '').replace(footer, '');

        if (title && about.length > 0 && applyUrl) {
            scrapedData.push({ Title: title, About: about, ApplyURL: applyUrl });
        }

        // console.log(scrapedData);
        // const csvParser = new Parser();
        // const csv = csvParser.parse(scrapedData);

        // fs.writeFile('scholarship.csv', csv, (err) => {
        //     if (err) throw err;
        //     console.log('File Saved');
        // });
        const existingData = await fs.promises.readFile('scholarship.csv', err => {
            if (err) throw err;
            console.log('Data read successfully');
        });

        const updateData = existingData + csv;

        await fs.promises.writeFile('scholarship.csv', updateData, err => {
            if (err) throw err;
            console.log('Data updated successfully');
        });

        // console.log(csv);
        // console.log('Data scrapped and saved to products.csv');
        await browser.close();
    } catch (error) {
        console.log(error);
    }
};

run_web_scrapper();