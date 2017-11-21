var express = require('express');
var puppeteer = require('puppeteer');
var router = express.Router();
var schedule = require('node-schedule');


var j = schedule.scheduleJob('* */10 * * * *', async () => {
  console.log('Reacteer remains running!');
  await screenshot("");
  await screenshot("helse");
  await screenshot("mote");
  await screenshot("motor");
  await screenshot("bolig");
  await screenshot("teknologi");
  await screenshot("bolig");
});

const screenshot = async (section) => {
  console.log("run section: " + section);
  const browser = await puppeteer.launch({
     args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  try {
    const page = await browser.newPage();
    await page.setViewport( { width: 1280, height: 1000, deviceScaleFactor: 1 } );
    await page.goto('http://www.klikk.no/' + section);
    await page.screenshot({
      path: 'public/images/klikk_' + section + '.png',
      fullPage:true,
      omitBackground:true
    });
  } catch(e) {
    console.log(e);
  } finally {
    await browser.close();
    console.log("shut down chromium");
  }
  console.log("end routine for section: " + section);
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
