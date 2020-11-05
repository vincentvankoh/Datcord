const { Pool } = require('pg');

let PG_URI = '';

if (process.env.NODE_ENV === 'test') {
  console.log("TEST MODE");
  // Use a test database when running npm test
  PG_URI = 'postgres://mltnekax:BZRMKAEF6HksAkNacSm5u7N2w-DWiH6u@lallah.db.elephantsql.com:5432/mltnekax';
} else {
  console.log("DEV MODE");
  // Use the development database when not running in test mode
  PG_URI =
    'postgres://nlnabeqa:pH3fPZ-Q_kaOm5h59XAjUBfkSPa6IkiP@lallah.db.elephantsql.com:5432/nlnabeqa';
}

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