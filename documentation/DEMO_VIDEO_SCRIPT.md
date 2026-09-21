# Demonstration video script

Target length: 8 to 10 minutes. The assessment allows a maximum of 15 minutes. Record the screen and your voice, keep text readable, and explain the code in your own words rather than reading this script verbatim.

## 0:00 to 0:40 Introduction

- State your name, student ID and the project title, Harbour Hope Community Events Portal.
- Explain that it is a dynamic charity-events website using MySQL, Node.js, Express, HTML, CSS, JavaScript and DOM APIs.
- Briefly show the project folders and the GitHub commit history.

## 0:40 to 2:20 Database design

- Open `api/database/charityevents_db.sql`.
- Explain the one-to-many relationships: one organisation has many events, and one category has many events.
- Point out primary keys, foreign keys, date and money checks, and indexes for date, city, category and status.
- Show that the data includes more than eight events, several categories, a past event and a suspended event.
- Explain that the public queries exclude suspended records.

## 2:20 to 4:10 API architecture and test

- Open `api/event_db.js`, `api/app.js` and `api/routes/events.js`.
- Explain the MySQL connection pool, Express routers, validation middleware, parameterised placeholders and consistent JSON error responses.
- Describe how `GET /api/events/search` builds conditions only for supplied date, location and category filters.
- Open `/api/health`, `/api/events?includePast=true` and one filtered search URL in the browser or Postman.
- Show `pnpm test` passing and briefly name the six tested behaviours.

## 4:10 to 5:30 Client and API data flow

- Open `client/assets/js/api.js` and explain the shared `fetch` wrapper, timeout and error handling.
- Open `home.js` or `search.js` and trace one flow: DOM ready, API request, JSON response, event-card creation and insertion into the page.
- Show how `event.html?id=3` passes an event ID and how `event.js` requests only that event.

## 5:30 to 8:30 Website demonstration

- Home page: show the organisation mission, impact figures, upcoming cards and past event status.
- Confirm the suspended sample event is not visible.
- Navigation: move to Find events and show that the menu is present on each page.
- Search: select the Fun Run category and enter `Harbour`; run the search and open the result.
- Validation: clear the form, submit with no filters and point out the visible error message.
- Clear filters: apply several filters, click Clear filters, and show that the controls and URL reset.
- Detail page: show full description, purpose, date, location, ticket price, capacity and fundraising progress.
- Enter non-sensitive demonstration values, click Register, and show the exact under-construction dialog.
- Narrow the browser window or use device emulation to show the responsive layout and mobile navigation.

## 8:30 to 9:30 Closing

- Summarise how the database, API and browser client satisfy the three assessment parts.
- State that write operations and real ticket purchasing are deliberately deferred to Assessment 3.
- Show the final GitHub URL and confirm the submission contains the report plus separate API and client-side ZIP files.

## Recording checklist

- Use 1080p if available and zoom the editor so code is readable.
- Close notifications and hide passwords, `.env` files and unrelated personal information.
- Test audio for ten seconds before the full recording.
- Keep the API and client terminals visible when starting the app.
- Upload the final video to SCU OneDrive, create a marker-accessible link, test it in a private browser window, and paste it into the report.
