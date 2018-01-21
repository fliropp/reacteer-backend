const fs = require('fs');
const createPuppeteerPool = require('puppeteer-pool');
const puppeteer = require('puppeteer');

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
          const status = await page.goto(section.url);
          if(!status.ok){
            throw new Error('Puppeteer Schmuppeteer...my a**')
          }
          await page.screenshot({
            path: 'public/images/' + section.section + '.png',
            fullPage:true,
            omitBackground:true
          });
          await page.close();
          return 'screenshots a\'ok 4 : ' + section.section;
      }).then((result) => {
        console.log('(takeScreenshot)RESULT: ' + result )
      });
    },

    linkStats:  async (section, pool) => {

      return res = await pool.use(
        async (browser) => {
          const page = await browser.newPage();
          const status = await page.goto(section.url);
          if(!status.ok){
            throw new Error('Puppeteer Schmuppeteer...my a**')
          }
          const tmpStatusMap = await page.evaluate(() => {
            const as = Array.from(document.querySelectorAll('a'));
            return as.map(a => {
              return [a.textContent, a.href];
            });
          });
          const statusMap = [];
          for(i = 0; i < 5/*tmpStatusMap.length*/; i++){
            const page = await browser.newPage();
            try {
              let sts = await page.goto(tmpStatusMap[i][1]);
              await page.close();
              console.log(sts.status, sts.url);
              statusMap.push([tmpStatusMap[i][0], tmpStatusMap[i][1], sts.status]);
            } catch (error) {
              statusMap.push([tmpStatusMap[i][0], tmpStatusMap[i][1], error]);
              await page.close();
            }
          }
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
