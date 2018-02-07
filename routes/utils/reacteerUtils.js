const fs = require('fs');
const createPuppeteerPool = require('puppeteer-pool');
const puppeteer = require('puppeteer');
const fetch = require('node-fetch');


const timeout = {
      networkIdleTimeout: 5000,
      waitUntil: 'networkidle',
      timeout: 20000
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
          try {
            await page.setViewport( { width: 1280, height: 1000, deviceScaleFactor: 1 } );
            const status = await page.goto(section.url, timeout);
            if(!status.ok){
              throw new Error('Puppeteer Schmuppeteer...my a**')
            }
            const docHeight = await page.evaluate(() => document.body.scrollHeight);
            console.log(docHeight);
            let image = await page.screenshot({
              path: 'public/images/' + section.section + '.png',
              //fullPage:true,
              clip : {
                x:0,
                y:0,
                width:1280,
                height:docHeight,
              },
              omitBackground:true
            });
            await page.close();
            return 'screenshots a\'ok 4 : ' + section.section;
          }catch(err) {
            await page.close();
            console.log('Screenshot for ' + section.section + 'could not be done . . .');
            console.log('error: ' + err);
          }
        })
        .then((result) => {
          console.log('(takeScreenshot)RESULT: ' + result );
          return true;
        });
    },

    linkStats:  async (section, pool) => {

      return res = await pool.use(
        async (browser) => {
          let tmpStatusMap = [];
          try {
            let page = await browser.newPage();
            let status = await page.goto(section.url, timeout);
            if(!status.ok){
              await page.close();
              throw new Error('Puppeteer Schmuppeteer...my a**')
            }
            tmpStatusMap = await page.evaluate(() => {
              const as = Array.from(document.querySelectorAll('a'));
              return as.map(a => {
                return [a.textContent, a.href];
              });
            });
            await page.close();
          }catch(err) {
            console.log('the page ' + section.section + 'could not be retrived. . .');
            console.log('error: ' + err);
            await page.close();
          }
          const statusMap = [];
          for(i = 0; i < 5 /*tmpStatusMap.length*/; i++){
            try {
              page = await browser.newPage();
              let sts = await page.goto(tmpStatusMap[i][1], timeout);
              console.log((sts.status !== null? sts.status: 'PPTR_ERR'), sts.url, i);
              statusMap.push([tmpStatusMap[i][0], tmpStatusMap[i][1], (sts.status !== null? sts.status: 'PPTR_ERR')]);
              await page.close();
            }catch (error) {
              statusMap.push([tmpStatusMap[i][0], tmpStatusMap[i][1], 'ERR']);
              console.log('link status for : ' + tmpStatusMap[i][1] + 'could not be determined');
              console.log('error: ' + error);
              await page.close();
            }
          }
          console.log("after for-loop");
          return statusMap;
      });
    }
  },

  utils: {

    removeDuplicateLinks: (links) => {
      return links.sort().filter((elem, pos, arr) => {
        return !pos || item != arr[pos - 1];
      });
    },

    write2file: async (section, data, path, postFix) => new Promise((resolve, reject) => {
      fs.writeFile(path + section.section + '.json', JSON.stringify(data), (err) =>{
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
    }),

    getFavicon: async (section, path) => {
      try {
        let response = await fetch('http://www.google.com/s2/favicons?domain=' + section.url);
        let dest = fs.createWriteStream(path + section.section + '.png');
        response.body.pipe(dest);
      }catch(err) {
        console.log('error on getFavicon: '+ err);
      }
    }
  },




}
