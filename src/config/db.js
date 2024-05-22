const { Pool } = require("pg");
const dbConfig = require("./db.config")

const pool = new Pool({
    host: dbConfig.HOST,
    port: dbConfig.PORT,
    user: dbConfig.USER,
    password: dbConfig.PASSWORD,
    database: dbConfig.DB
})

pool.connect(error => {
    if (error) throw error;
    console.log("Successfully connected to the database")
});

module.exports = pool;