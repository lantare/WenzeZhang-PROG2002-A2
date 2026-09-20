const mysql = require("mysql2/promise");
const config = require("./config");

const pool = mysql.createPool({
  ...config.database,
  waitForConnections: true,
  queueLimit: 0,
  decimalNumbers: true,
  dateStrings: true,
});

async function testDatabaseConnection(database = pool) {
  const connection = await database.getConnection();
  try {
    await connection.ping();
  } finally {
    connection.release();
  }
}

module.exports = { pool, testDatabaseConnection };
