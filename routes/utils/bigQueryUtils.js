const BigQuery = require('@google-cloud/bigquery');

const sqlQuery = 'SELECT * FROM ARE_TEST.reacteer';
const options = {
  query: sqlQuery,
  timeoutMs: 10000,
  useLegacySql: false,
};
const projectId = 'egmont-big-data';
const bigquery = new BigQuery({
  projectId: projectId,
});


module.exports = {
  /*getClient : async () => new Promise((resolve, reject) => {
    console.log('getting BQ client...');
    new BigQuery({projectId: 'egmont-big-data',}, (err, data) => {
      if(err){
        console.log(err);
        reject(err);
      } else {
        console.log(data);
        resolve(data);
      }
    });
  }),*/

  runQuery: async () => {
    await bigquery
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
