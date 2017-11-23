const express = require('express');
const puppeteer = require('puppeteer');
const router = express.Router();
const schedule = require('node-schedule');
const createPuppeteerPool = require('puppeteer-pool');
const reacteer = require('./reacteerUtils/reacteerUtils.js');
const fs = require('fs');

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

const j = schedule.scheduleJob('*/15 * * * * *', async () => {
  console.log('Reacteer remains running!');
  if(!lock) {
    lock = true;
    console.log('lock not set - run routine . . . ');
    const report = await runLinkStats("", reacteer);
    lock = false;
  }else{
    console.log('lock is set - drop routine . . . ');
  }


  /*await reacteer.takeScreenshot("", pool);
  await reacteer.takeScreenshot("helse", pool);
  await reacteer.takeScreenshot("motor", pool);
  await reacteer.takeScreenshot("mote", pool);
  await reacteer.takeScreenshot("mat", pool);
  await reacteer.takeScreenshot("bolig", pool);
  await reacteer.takeScreenshot("teknologi", pool);*/
});

const runLinkStats = async (section, rcteer) => new Promise((resolve, reject) => {
  console.log("gittin there...1");
  const resultSet = await rcteer.linkStats(section, pool);
  fs.writeFile("public/json/" + section !== ''? section:'klikk'  + '.json', JSON.stringify(resultSet), (err) =>{
      if(err){
        reject(err);
      } else {
        resolve(true);
      }
  });
});

const rct = async () => new Promise((resolve, reject) => {
  setTimeout(() => resolve('react'), 5000)
});


router.get('/', function(req, res, next) {
  let fend = rct();
  fend.then((f) => res.json({frontend: f , backend: xprss()}));
});

router.get('/linkstats', function(req, res, next) {
  let lstats = runLinkstats();

  lstats.then((data) => res.json(JSON.stringify(data)));
});


module.exports = router;
