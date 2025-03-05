require('dotenv').config();
const { Pool } = require('pg');

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {
        rejectUnauthorized: false, 
    },
});

pool.connect()
    .then(() => console.log("🟢 Connecté à PostgreSQL"))
    .catch(err => console.error("🔴 Erreur de connexion PostgreSQL", err));

module.exports = pool;
