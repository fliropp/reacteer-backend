const BigQuery = require('@google-cloud/bigquery');

const sqlQuery = 'SELECT * FROM ARE_TEST.reacteer';
const options = {
  query: sqlQuery,
  timeoutMs: 10000,
  useLegacySql: false,
};

module.exports = {
  getClient : async () => new Promise((resolve, reject) => {
    new BigQuery({projectId: 'egmont-big-data',}, (err, data) => {
      if(err){
        reject(err);
      } else {
        resolve(data);
      }
    });
  }),

  runQuery: async (bqc) => {
    await bqc
      .query(options)
      .then(results => {
        const rows = results[0];
        console.log('Rows:');
        rows.forEach(row => console.log(row));
      })
      .catch(err => {
        console.error('ERROR:', err);
      });
  }
}
