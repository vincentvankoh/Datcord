const { Pool } = require('pg');

const PG_URI =
'postgres://nlnabeqa:pH3fPZ-Q_kaOm5h59XAjUBfkSPa6IkiP@lallah.db.elephantsql.com:5432/nlnabeqa';

// create a new pool here using the connection string above
const pool = new Pool({
  connectionString: PG_URI,
});

module.exports = {
  query: (text, params, callback) => {
    console.log('Query: ', text);
    return pool.query(text, params, callback);
  },
}