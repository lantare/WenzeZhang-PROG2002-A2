const express = require("express");
const { asyncHandler, HttpError } = require("../middleware/errors");
const { parsePositiveId, parseBoolean, parseSearchFilters } = require("../middleware/validation");

const EVENT_SELECT = `
  SELECT
    e.id,
    e.name,
    e.slug,
    e.summary,
    e.full_description,
    e.purpose,
    e.start_datetime,
    e.end_datetime,
    e.venue_name,
    e.address,
    e.city,
    e.ticket_price,
    e.currency,
    e.fundraising_goal,
    e.amount_raised,
    e.capacity,
    e.image_path,
    e.status,
    c.id AS category_id,
    c.name AS category_name,
    c.slug AS category_slug,
    o.id AS organization_id,
    o.name AS organization_name,
    CASE WHEN e.end_datetime < NOW() THEN 'past' ELSE 'upcoming' END AS temporal_status,
    CASE
      WHEN e.fundraising_goal = 0 THEN 0
      ELSE LEAST(100, ROUND((e.amount_raised / e.fundraising_goal) * 100, 1))
    END AS progress_percentage
  FROM events e
  JOIN categories c ON c.id = e.category_id
  JOIN organizations o ON o.id = e.organization_id
`;

function buildEventsRouter(database) {
  const router = express.Router();

  router.get("/search", asyncHandler(async (request, response) => {
    const filters = parseSearchFilters(request.query);
    const conditions = ["e.status = 'active'"];
    const parameters = [];

    if (filters.date) {
      conditions.push("DATE(e.start_datetime) = ?");
      parameters.push(filters.date);
    }
    if (filters.location) {
      conditions.push("(e.city LIKE ? OR e.venue_name LIKE ? OR e.address LIKE ?)");
      const term = `%${filters.location}%`;
      parameters.push(term, term, term);
    }
    if (filters.category) {
      conditions.push("e.category_id = ?");
      parameters.push(filters.category);
    }

    const [events] = await database.execute(
      `${EVENT_SELECT} WHERE ${conditions.join(" AND ")} ORDER BY e.start_datetime ASC LIMIT 100`,
      parameters,
    );

    response.json({ data: events, meta: { count: events.length, filters } });
  }));

  router.get("/:id", asyncHandler(async (request, response) => {
    const eventId = parsePositiveId(request.params.id, "event id");
    const [events] = await database.execute(
      `${EVENT_SELECT} WHERE e.id = ? AND e.status = 'active' LIMIT 1`,
      [eventId],
    );

    if (events.length === 0) {
      throw new HttpError(404, "EVENT_NOT_FOUND", "The requested event was not found.");
    }

    response.json({ data: events[0] });
  }));

  router.get("/", asyncHandler(async (request, response) => {
    const includePast = parseBoolean(request.query.includePast, false);
    const conditions = ["e.status = 'active'"];
    if (!includePast) conditions.push("e.end_datetime >= NOW()");

    const [events] = await database.execute(
      `${EVENT_SELECT} WHERE ${conditions.join(" AND ")} ORDER BY e.start_datetime ASC LIMIT 100`,
    );

    response.json({ data: events, meta: { count: events.length, includePast } });
  }));

  return router;
}

module.exports = { buildEventsRouter };
