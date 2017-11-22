const express = require('express');
const puppeteer = require('puppeteer');
const router = express.Router();
const schedule = require('node-schedule');
const createPuppeteerPool = require('puppeteer-pool');
const reacteer = require('./reacteerUtils/reacteerUtils.js');

const pool = createPuppeteerPool({
  max: 10,
  min: 2,
  idleTimeoutMillis: 30000,
  maxUses: 0,
  validator: () => Promise.resolve(true),
  testOnBorrow: true,
  puppeteerArgs: []
})

const j = schedule.scheduleJob('*/15 * * * * *', async () => {
  console.log('Reacteer remains running!');
  await reacteer.takeScreenshot("", pool);
  await reacteer.takeScreenshot("helse", pool);
  await reacteer.takeScreenshot("motor", pool);
  await reacteer.takeScreenshot("mote", pool);
  await reacteer.takeScreenshot("mat", pool);
  await reacteer.takeScreenshot("bolig", pool);
  await reacteer.takeScreenshot("teknologi", pool);
});

const runLinkstats = async () => {
  console.log("gittin there...1");
  return await reacteer.linkStats("", pool);
};

const rct = async () => new Promise((resolve, reject) => {
  setTimeout(() => resolve('react'), 5000)
});


router.get('/', function(req, res, next) {
  let fend = rct();
  fend.then((f) => res.json({frontend: f , backend: xprss()}));
});

router.get('/linkstats', function(req, res, next) {
  console.log("gittin there...0");
  let lstats = runLinkstats();
  console.log("gittin there...2");

  lstats.then((data) => res.json({frontend: data , backend: '...schmackend'}));
});


module.exports = router;
