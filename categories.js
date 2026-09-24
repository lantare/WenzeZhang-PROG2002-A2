const express = require("express");
const { asyncHandler } = require("../middleware/errors");

function buildCategoriesRouter(database) {
  const router = express.Router();

  router.get("/", asyncHandler(async (request, response) => {
    const [categories] = await database.execute(`
      SELECT id, name, slug, description
      FROM categories
      ORDER BY name ASC
    `);
    response.json({ data: categories, meta: { count: categories.length } });
  }));

  return router;
}

module.exports = { buildCategoriesRouter };
