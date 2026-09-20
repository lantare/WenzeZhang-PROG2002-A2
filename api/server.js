const config = require("./config");
const { pool, testDatabaseConnection } = require("./event_db");
const { createApp } = require("./app");

async function start() {
  await testDatabaseConnection();
  const app = createApp({ database: pool });
  const server = app.listen(config.port, () => {
    console.log(`Harbour Hope API listening on http://localhost:${config.port}`);
  });

  async function shutdown(signal) {
    console.log(`${signal} received. Closing server.`);
    server.close(async () => {
      await pool.end();
      process.exit(0);
    });
  }

  process.on("SIGINT", () => shutdown("SIGINT"));
  process.on("SIGTERM", () => shutdown("SIGTERM"));
}

start().catch((error) => {
  console.error("API startup failed:", error.message);
  process.exit(1);
});
