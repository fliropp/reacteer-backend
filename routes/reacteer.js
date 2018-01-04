const express = require('express');
const puppeteer = require('puppeteer');
const router = express.Router();
const schedule = require('node-schedule');
const createPuppeteerPool = require('puppeteer-pool');
const reacteer = require('./utils/reacteerUtils.js');
const lighthousekeeper = require('./utils/lighthouseUtils.js');

const sections = ['', 'helse', 'motor', 'bolig', 'mote', 'mat', 'teknologi'];

const pool = createPuppeteerPool({
  max: 10,
  min: 2,
  idleTimeoutMillis: 30000,
  maxUses: 0,
  validator: () => Promise.resolve(true),
  testOnBorrow: true,
  puppeteerArgs: []
});

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
  index = []; i = 0;
  sections.map(s => index.push(i++));
  for(const idx of index){
    console.log('run linkstats for ' + sections[idx] + '...');
    let report = await r.puppeteer.linkStats(sections[idx], pool);
    console.log('write ' + report.length + ' entries to file ' + sections[idx] + '.json...');
    await r.utils.write2file(sections[idx], report);
    console.log('take screenshot of section... ' + sections[idx]);
    await r.puppeteer.takeScreenshot(sections[idx], pool);
    console.log('get Lighthouse data for section klikk/' + sections[idx]);
    let lighthouseData = await lighthousekeeper.lighthouse.lighthouseReport(sections[idx]);
    await lighthousekeeper.utils.write2file(sections[idx], lighthouseData);

  }
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
