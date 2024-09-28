const { Pool } = require('pg');

// Create a new pool (connection to the database)
const pool = new Pool({
  user: 'enithank',    // Database username
  host: 'localhost',       // Database host (for local development)
  database: 'study_tool', // Database name
  password: '1234', // Database password
  port: 5432,              // Default PostgreSQL port
});

module.exports = pool;
