const { HttpError } = require("./errors");

function parsePositiveId(value, fieldName = "id") {
  if (!/^\d+$/.test(String(value))) {
    throw new HttpError(400, "INVALID_PARAMETER", `${fieldName} must be a positive integer.`);
  }

  const id = Number.parseInt(value, 10);
  if (id < 1) {
    throw new HttpError(400, "INVALID_PARAMETER", `${fieldName} must be a positive integer.`);
  }
  return id;
}

function parseBoolean(value, fallback = false) {
  if (value === undefined) return fallback;
  if (value === "true") return true;
  if (value === "false") return false;
  throw new HttpError(400, "INVALID_PARAMETER", "includePast must be true or false.");
}

function isValidIsoDate(value) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const [year, month, day] = value.split("-").map(Number);
  const date = new Date(Date.UTC(year, month - 1, day));
  return date.getUTCFullYear() === year
    && date.getUTCMonth() === month - 1
    && date.getUTCDate() === day;
}

function parseSearchFilters(query) {
  const filters = {};

  if (query.date) {
    const date = String(query.date);
    if (!isValidIsoDate(date)) {
      throw new HttpError(400, "INVALID_DATE", "date must use the YYYY-MM-DD format.");
    }
    filters.date = date;
  }

  if (query.location) {
    const location = String(query.location).trim();
    if (location.length > 80) {
      throw new HttpError(400, "INVALID_LOCATION", "location must be 80 characters or fewer.");
    }
    if (location) filters.location = location;
  }

  if (query.category) {
    filters.category = parsePositiveId(query.category, "category");
  }

  return filters;
}

module.exports = { parsePositiveId, parseBoolean, parseSearchFilters };
