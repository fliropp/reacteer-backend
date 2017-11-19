var express = require('express');
var puppeteer = require('puppeteer');
var router = express.Router();

/* GET users listing. */


router.get('/img', function(req, res, next) {
  (async() => {
     const browser = await puppeteer.launch({
        args: ['--no-sandbox', '--disable-setuid-sandbox']
     });
     try {
        const page = await browser.newPage();
        await page.setViewport({width: 1000, height: 800});
        await page.goto('http://www.klikk.no/');
        let sh = await page.screenshot({
           clip: {
              x: 0,
              y: 0,
              width: 300,
              height: 800
           }
        });
        res.writeHead(200, {
           'Content-Type': 'image/png',
           'Cache-Control': 'no-transform, max-age=' + 10 + ', s-maxage=' + 10
        });
        res.end(sh); // Send the file data to the browser.
     } catch (e) {
        console.log(e);
     } finally {
        browser.close();
     }
  })();
});

router.get('/', function(req, res, next) {
  let fend = rct();
  fend.then((f) => res.json({frontend: f , backend: xprss()}));
});

const rct = async () => new Promise((resolve, reject) => {
  setTimeout(() => resolve('react'), 5000)
});


const xprss = () => {
  return 'express'
}
/*
const snap = async () {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto('http://www.klikk.no/');
  await page.screenshot({path: '../images/klikk.png', fullPage:true, omitBackground:true});
  await browser.close();
}
*/
module.exports = router;
