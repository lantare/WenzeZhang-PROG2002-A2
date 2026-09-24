const express = require("express");
const { asyncHandler, HttpError } = require("../middleware/errors");

function buildOrganizationRouter(database) {
  const router = express.Router();

  router.get("/", asyncHandler(async (request, response) => {
    const [organizations] = await database.execute(`
      SELECT id, name, mission, description, email, phone, website, address, city
      FROM organizations
      WHERE is_active = TRUE
      ORDER BY id ASC
      LIMIT 1
    `);

    if (organizations.length === 0) {
      throw new HttpError(404, "ORGANIZATION_NOT_FOUND", "No active organization was found.");
    }

    response.json({ data: organizations[0] });
  }));

  return router;
}

module.exports = { buildOrganizationRouter };
