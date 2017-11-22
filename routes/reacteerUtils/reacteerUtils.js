module.exports = {

  takeScreenshot:  async (section, pool) => {
    await pool.use(
      async (browser) => {
        console.log("getscreenshot for section: " + section);
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
        return 'screenshots a\'ok 4 : ' + section;
    }).then((result) => {
      console.log('(takeScreenshot)RESULT: ' + result )
    });
  },

  linkStats:  async (section, pool) => {
    return res = await pool.use(
      async (browser) => {
        console.log("get linkStats: " + section);
        const page = await browser.newPage();
        const status = await page.goto('http://www.klikk.no/' + section);
        if(!status.ok){
          throw new Error('Puppeteer Schmuppeteer...my a**')
        }
        const links = await page.evaluate(() => {
          const as = Array.from(document.querySelectorAll('a'));
          return as.map(a => [a.textContent, a.href, test(a.href)]);
        });
        await page.close();
        return links;
    });

    let test = (url) => {
      return url + '______test';
    }
  }


}
