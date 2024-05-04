import express from 'express';
import { dirname } from 'path';
import { fileURLToPath } from 'url';
import puppeteer from 'puppeteer';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const port = 3000;

app.get('/puppeteer', (req, res) => {
    res.sendFile(__dirname + '/src/puppeteer.html');
});

app.get('/puppeteer_pdf', async (req, res) => {
    URL = req.query.url
    console.log(URL)

    console.time('Time to generate PDF');
    try {
        const browser = await puppeteer.launch();
        const page = await browser.newPage();
        await page.goto(URL, {
            waitUntil: 'networkidle2'
        });
        page.setViewport({ width: 3840, height: 2160, deviceScaleFactor: 2});
        page.emulateMediaType('screen');
        const pdf = await page.pdf({ 
            path: 'puppeteer.pdf',
            format: 'A4',
            pageRanges: '1',
            printBackground: true});
        await browser.close();

        res.contentType('application/pdf');
        res.send(pdf);
    } catch (error) {
        console.log(error);
        res.send('An error occurred');
    }
    console.timeEnd('Time to generate PDF');
});

app.get('/', (req, res) => {
    res.redirect('/puppeteer');
});

app.listen(port, () => {
    console.log(`Listening at http://localhost:${port}`);
});