const { Pool } = require('pg');
require('dotenv').config();

let PG_URI = '';

if (process.env.NODE_ENV === 'test') {
  PG_URI = process.env.PG_URI_TEST;
} else {
  console.log('DEV MODE');
  // Use the development database when not running in test mode
  PG_URI = process.env.PG_URI_DEV;
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
};
