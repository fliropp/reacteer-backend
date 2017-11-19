var express = require('express');
var puppeteer = require('puppeteer');
var router = express.Router();
var schedule = require('node-schedule');

/* GET users listing. */
var j = schedule.scheduleJob('*/60 * * * * *', function(){
  console.log('Reacteer remains running!');
  screenshot("");
  screenshot("helse");
  screenshot("mote");
  screenshot("motor");
  screenshot("bolig");
  screenshot("teknologi");
  screenshot("bolig");


  /*const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto('http://www.klikk.no/');
  await page.screenshot({path: '../public/images/klikk.png', fullPage:true, omitBackground:true});
  await browser.close();*/
});

screenshot = async (section) => {
    const browser = await puppeteer.launch({
       args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    try {
      const page = await browser.newPage();
      await page.goto('http://www.klikk.no/' + section);
      await page.screenshot({
        path: 'public/images/klikk_' + section + '.png',
        fullPage:true,
        omitBackground:true,
        clip: {
          x: 0,
          y: 0,
          width: 2500,
          height: 8000
         }
      });
    } catch(e) {
      console.log(e);
    } finally {
      await browser.close();
    }
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
