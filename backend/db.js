const mysql = require('mysql2/promise');

const db = mysql.createPool({
  host: 'secondlife-mansourbabydriver221-a342.h.aivencloud.com',
  port: 17219,
  user: 'avnadmin',
  password: 'AVNS_XuN9vfkGBg1N83Td8q3',
  database: 'secondlife',
  ssl: {
    rejectUnauthorized: false // test local
  },
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

module.exports = db;
