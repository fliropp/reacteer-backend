const express = require('express');
const puppeteer = require('puppeteer');
const router = express.Router();
const schedule = require('node-schedule');
const reacteer = require('./utils/reacteerUtils.js');
const lighthousekeeper = require('./utils/lighthouseUtils.js');
const urlset = require('./utils/resources/urls.json');
const puppeteerPath = 'public/json/';
const faviconPath = 'public/favicons/';
const lighthousePath = 'public/lighthouse/';

const sections = urlset.urls; //['', 'helse', 'motor', 'bolig', 'mote', 'mat', 'teknologi'];
console.log(sections);
let lock = false;

const j = schedule.scheduleJob('*/10 * * * * *', async () => {
  console.log('Reacteer remains running!');
  if(!lock) {
    lock = true;
    console.log('lock not set - run routine . . . ');
    await runReacteerScan(reacteer, lighthousekeeper);
    console.log('routine done - release lock . . . ');
    lock = false;
  }
});

const runReacteerScan = async (r, l)=> {
  let pool = await reacteer.puppeteer.createReacteerPool();
  index = []; i = 0;
  sections.map(s => index.push(i++));
  try {
    for(const idx of index){
      console.log('run linkstats for ' + sections[idx].section + '...');
      let report = await reacteer.puppeteer.linkStats(sections[idx], pool);
      console.log('write ' + report.length + ' entries to file ' + sections[idx].section + '.json...');
      await r.utils.write2file(sections[idx], report, puppeteerPath, '.json');
      console.log('take screenshot of section... ' + sections[idx].section);
      let scrsh_ok = await reacteer.puppeteer.takeScreenshot(sections[idx], pool);
      console.log('get Lighthouse data for section ' + sections[idx].section);
      let lighthouseData = await lighthousekeeper.lighthouse.lighthouseReport(sections[idx]);
      await r.utils.write2file(sections[idx], lighthouseData, lighthousePath, '.json');
      console.log("get favicon...");
      await r.utils.getFavicon(sections[idx], faviconPath);
    }
  }catch(err){
    console.log('Error cast to runReacteerScan: ' + err);
  }
  console.log('drain pool . . .');
  pool.drain().then(() => pool.clear());
}

router.get('/', function(req, res, next) {
  let fend = rct();
  fend.then((f) => res.json({frontend: f , backend: xprss()}));
});

router.get('/linkstats', function(req, res, next) {
  const jsn = readFromFile('public/json/.json');
  res.json(JSON.stringify(jsn));
});

module.exports = router;
