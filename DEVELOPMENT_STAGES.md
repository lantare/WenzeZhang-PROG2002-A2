# Three-stage development and submission plan

The folders in `stage-packages` are snapshots for incremental work. GitHub progress must be genuine: use these files to make real commits in order, with time to review each stage. Do not rewrite commit dates or present fabricated history.

## Stage 1 Database and foundational API

Archive: `01-stage-database-api.zip`

Contents:

- MySQL database named `charityevents_db`
- `organizations`, `categories` and `events` tables
- Primary keys, foreign keys, checks and search indexes
- 11 event records across six categories, including one suspended record
- `event_db.js` connection pool and environment configuration
- Health, organisation, category, event list, search and event-detail routes
- Parameter validation, parameterised SQL and structured errors
- Automated API route tests

Suggested commit message: `Build charity event database and read-only API`

Verify with `pnpm test`, then import the SQL file and call `/api/health` before committing.

## Stage 2 Complete responsive website

Archive: `02-stage-complete-website.zip`

Contents:

- Everything from Stage 1
- API-driven home page with current, upcoming and past status
- Date, location and category search with multiple filters
- DOM-based Clear filters and visible validation/error states
- Event detail page selected by query-string event ID
- Ticket information, goal-versus-progress display and registration form
- Required under-construction registration dialog
- Responsive navigation, keyboard-friendly controls and mobile layout
- Local event artwork and shared client modules

Suggested commit message: `Add responsive API-driven charity events client`

Verify home, search and event-detail pages at desktop and mobile widths before committing.

## Stage 3 Final evidence and submission

Archive: `03-stage-final-submission.zip`

Contents:

- Complete source from Stages 1 and 2
- Root run guide
- Development stages, test checklist and video script
- Completed report template with personal/link placeholders
- Final API and client-side submission archives

Suggested commit message: `Complete report, verification notes and submission package`

Before the last commit, fill the report placeholders, record the demonstration, add the final links, rerun the checklist, and rename the final ZIP files with your username.

