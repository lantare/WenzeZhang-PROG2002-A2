const path = require("node:path");

require("dotenv").config({ path: path.join(__dirname, ".env") });

function positiveInteger(value, fallback) {
  const parsed = Number.parseInt(value, 10);
  return Number.isInteger(parsed) && parsed > 0 ? parsed : fallback;
}

module.exports = {
  port: positiveInteger(process.env.PORT, 3000),
  clientOrigin: process.env.CLIENT_ORIGIN || "http://localhost:5500",
  database: {
    host: process.env.DB_HOST || "localhost",
    port: positiveInteger(process.env.DB_PORT, 3306),
    user: process.env.DB_USER || "root",
    password: process.env.DB_PASSWORD || "",
    database: process.env.DB_NAME || "charityevents_db",
    connectionLimit: positiveInteger(process.env.DB_CONNECTION_LIMIT, 10),
  },
};
