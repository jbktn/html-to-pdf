import express from 'express';
import { dirname } from 'path';
import { fileURLToPath } from 'url';
import puppeteer from 'puppeteer';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();

app.get('/puppeteer', (req, res) => {
    res.sendFile(__dirname + '/src/puppeteer.html');
});

app.get('/puppeteer_pdf', async (req, res) => {
    console.log("Puppeteer")

    URL = req.query.url
    console.log(URL)

    try {
        const browser = await puppeteer.launch();
        const page = await browser.newPage();
        await page.goto(URL, {waitUntil: 'networkidle2'});
        const pdf = await page.pdf({ format: 'A4' });
        await browser.close();

        res.contentType('application/pdf');
        res.send(pdf);
    } catch (error) {
        console.log(error);
        res.send('An error occurred');
    }
});

app.get('/', (req, res) => {
    res.redirect('/puppeteer');
});

app.listen(3000, () => {
    console.log('Server is running on port 3000');
});