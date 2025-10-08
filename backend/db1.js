// backend/db.js
const mysql = require('mysql2/promise'); // version promise pour async/await
require('dotenv').config();

const db = mysql.createPool({
  host: process.env.DB_HOST || '127.0.0.1', // éviter ::1
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'secondlife',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Tester la connexion au démarrage
(async () => {
  try {
    const connection = await db.getConnection();
    console.log('✅ Connecté à la base de données MySQL');
    connection.release();
  } catch (err) {
    console.error('❌ Impossible de se connecter à la base de données MySQL :');
    console.error(err.message);
    process.exit(1); // quitte le serveur si la connexion échoue
  }
})();

module.exports = db;
