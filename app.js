const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const config = require("./config");
const { asyncHandler, notFoundHandler, errorHandler } = require("./middleware/errors");
const { buildEventsRouter } = require("./routes/events");
const { buildCategoriesRouter } = require("./routes/categories");
const { buildOrganizationRouter } = require("./routes/organization");

function createApp({ database, clientOrigin = config.clientOrigin }) {
  const app = express();

  app.disable("x-powered-by");
  app.use(helmet({ crossOriginResourcePolicy: false }));
  app.use(cors({ origin: clientOrigin }));
  app.use(express.json({ limit: "50kb" }));

  app.get("/api/health", asyncHandler(async (request, response) => {
    await database.execute("SELECT 1 AS database_ok");
    response.json({ data: { status: "ok", database: "connected" } });
  }));

  app.use("/api/events", buildEventsRouter(database));
  app.use("/api/categories", buildCategoriesRouter(database));
  app.use("/api/organization", buildOrganizationRouter(database));

  app.use(notFoundHandler);
  app.use(errorHandler);
  return app;
}

module.exports = { createApp };
