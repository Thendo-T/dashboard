const { Pool } = require('pg');

const pool = new Pool({
  user: 'avnadmin',
  host: 'pg-dashboard-thendothovhakale0002-96a1.c.aivencloud.com',
  database: 'defaultdb',
  password: 'AVNS_ssj5Su7_y2QWK50Zoxb',
  port: 18978,
  ssl: { rejectUnauthorized: false },
});

module.exports = pool;
