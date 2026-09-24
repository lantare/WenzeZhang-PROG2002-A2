# Final test checklist

## Database and API

- [ ] Import `api/database/charityevents_db.sql` into MySQL 8 without errors.
- [ ] Configure `api/.env` with the read-only application user and a non-sample password.
- [ ] Run `pnpm test` in `api` and confirm all six tests pass.
- [ ] Start the API and confirm `/api/health` reports a connected database.
- [ ] Confirm `/api/events?includePast=true` returns past and upcoming active events.
- [ ] Confirm the suspended event never appears in list, search or detail responses.
- [ ] Confirm a combined date/location/category search returns the expected event.
- [ ] Confirm invalid dates and event IDs return structured 400/404 responses.

## Browser client

- [ ] Home page loads organisation content and API-driven event cards.
- [ ] Every page has working Home and Find events navigation.
- [ ] Date, location and category work separately and in combination.
- [ ] Submitting with no filters shows a visible validation message.
- [ ] Clear filters resets all controls, results and query parameters.
- [ ] Event links open the correct query-string detail page.
- [ ] Detail page shows description, purpose, date, venue, address, price, capacity and progress.
- [ ] Register opens a dialog containing `This feature is currently under construction.`
- [ ] Desktop and 390 px mobile layouts have no overlap or horizontal scrolling.
- [ ] Browser console has no warnings or errors.

## Submission

- [ ] Replace all square-bracket placeholders in the report.
- [ ] Add the private, accessible GitHub URL and verify genuine staged commits.
- [ ] Add and test the SCU OneDrive video link.
- [ ] Replace `USERNAME` in both final ZIP filenames.
- [ ] Confirm ZIP files do not contain `node_modules`, `.env`, temporary files or secrets.
- [ ] Submit the report, both ZIP files, GitHub link and video link.
