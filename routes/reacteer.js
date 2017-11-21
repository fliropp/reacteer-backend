const express = require('express');
const puppeteer = require('puppeteer');
const router = express.Router();
const schedule = require('node-schedule');
const createPuppeteerPool = require('puppeteer-pool');

const pool = createPuppeteerPool({
  max: 10,
  min: 2,
  idleTimeoutMillis: 30000,
  maxUses: 0,
  validator: () => Promise.resolve(true),
  testOnBorrow: true,
  puppeteerArgs: []
})

var j = schedule.scheduleJob('*/1 * * * *', async () => {
  console.log('Reacteer remains running!');
  await screenshot("");
  await screenshot("helse");
  await screenshot("mote");
  await screenshot("motor");
  await screenshot("bolig");
  await screenshot("teknologi");
});

const screenshot = async (section) => {
  await pool.use(
    async (browser) => {
      console.log("run section: " + section);
      const page = await browser.newPage();
      await page.setViewport( { width: 1280, height: 1000, deviceScaleFactor: 1 } );
      const status = await page.goto('http://www.klikk.no/' + section);
      if(!status.ok){
        throw new Error('Puppeteer Schmuppeteer...my a**')
      }
      await page.screenshot({
        path: 'public/images/klikk_' + section + '.png',
        fullPage:true,
        omitBackground:true
      });
      await page.close();
      return 'touchdown for section: ' + section;
  }).then((result) => {
    console.log('RESULT: ' + result )
  });
}


router.get('/', function(req, res, next) {
  let fend = rct();
  fend.then((f) => res.json({frontend: f , backend: xprss()}));
});


router.get('/img', function(req, res, next) {
  (async() => {
     const browser = await puppeteer.launch({
        args: ['--no-sandbox', '--disable-setuid-sandbox']
     });
     try {
        const page = await browser.newPage();
        await page.setViewport( { width: 1280, height: 1000, deviceScaleFactor: 1 } );
        await page.goto('http://www.klikk.no/' + req.query.sec);
        console.log(req.query.sec);
        //let sh = await page.screenshot({fullPage: true, clip: {x:0, y: 0}});
        let sh = await page.screenshot({
          path: '../public/images/klikk.png',
          clip: {
            x: 0,
            y: 0,
            width: 2500,
            height: 8000
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

const rct = async () => new Promise((resolve, reject) => {
  setTimeout(() => resolve('react'), 5000)
});


const xprss = () => {
  return 'express'
}



module.exports = router;
