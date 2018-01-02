const lighthouse = require('lighthouse');
const chromeLauncher = require('chrome-launcher');
const config = require('lighthouse/lighthouse-core/config/perf.json');
const fs = require('fs');

module.exports = {
  lighthouse : {
    lighthouseReport : async (section) => {
      flags = {output:'json'};
      return chromeLauncher.launch({chromeFlags: ['--headless', '--disable-gpu'], output:'json'}).then(chrome => {
        flags.port = chrome.port;
        return lighthouse("http://www.klikk.no/" + section, flags, config).then(results =>
          chrome.kill().then(() => results));
      });
    }
  },

  utils : {
    write2file: async (section, data) => new Promise((resolve, reject) => {
      fs.writeFile('public/lighthouse/klikk_' + section + '.json', JSON.stringify(data.audits), (err) =>{
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
