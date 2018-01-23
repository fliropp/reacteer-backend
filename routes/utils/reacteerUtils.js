const fs = require('fs');
const createPuppeteerPool = require('puppeteer-pool');
const puppeteer = require('puppeteer');

const timeout = {
      networkIdleTimeout: 5000,
      waitUntil: 'networkidle',
      timeout: 15000
  };

module.exports = {

  puppeteer: {

    createReacteerPool: async () => {
      return createPuppeteerPool({
        max: 10,
        min: 2,
        idleTimeoutMillis: 50000,
        maxUses: 0,
        validator: () => Promise.resolve(true),
        testOnBorrow: true,
        puppeteerArgs: []
      });
    },

    takeScreenshot:  async (section, pool) => {
      await pool.use(
        async (browser) => {
          const page = await browser.newPage();
          await page.setViewport( { width: 1280, height: 1000, deviceScaleFactor: 1 } );
          const status = await page.goto(section.url, timeout);
          if(!status.ok){
            throw new Error('Puppeteer Schmuppeteer...my a**')
          }
          let image = await page.screenshot({
            path: 'public/images/' + section.section + '.png',
            //fullPage:true,
            clip : {
              x:0,
              y:0,
              width:1280,
              height:5000,
            },
            omitBackground:true
          });
          await page.close();
          await browser.close();
          return 'screenshots a\'ok 4 : ' + section.section;
      }).then((result) => {
        console.log('(takeScreenshot)RESULT: ' + result )
      });
    },

    linkStats:  async (section, pool) => {

      return res = await pool.use(
        async (browser) => {
          let page = await browser.newPage();
          const status = await page.goto(section.url, timeout);
          if(!status.ok){
            await page.close();
            throw new Error('Puppeteer Schmuppeteer...my a**')
          }
          const tmpStatusMap = await page.evaluate(() => {
            const as = Array.from(document.querySelectorAll('a'));
            return as.map(a => {
              return [a.textContent, a.href];
            });
          });
          const statusMap = [];
          for(i = 0; i < tmpStatusMap.length; i++){
            page = await browser.newPage();
            try {
              console.log(tmpStatusMap.length);
              let sts = await page.goto(tmpStatusMap[i][1], timeout);
              console.log(sts.status, sts.url, i);
              statusMap.push([tmpStatusMap[i][0], tmpStatusMap[i][1], sts.status]);
          }catch (error) {
              statusMap.push([tmpStatusMap[i][0], tmpStatusMap[i][1], 'ERR']);
              console.log('log err inside linkStats: ' + error);
            }
          }
          console.log("after for-loop");
          await page.close();
          await browser.close();
          return statusMap;
      });
    }
  },

  utils: {


    write2file: async (section, data) => new Promise((resolve, reject) => {
      fs.writeFile('public/json/' + section.section + '.json', JSON.stringify(data), (err) =>{
          if(err){
            reject(err);
          } else {
            resolve(true);
          }
      });
    }),

    readFromFile: async (path) => new Promise((resolve, reject) => {
      fs.readFile(path, JSON.stringify(data), (err, data) =>{
          if(err){
            reject(err);
          } else {
            resolve(data);
          }
      });
    })
  }


}
