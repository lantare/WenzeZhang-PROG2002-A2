document.addEventListener("DOMContentLoaded", async () => {
  const container = document.querySelector("#event-content");
  const eventId = new URLSearchParams(location.search).get("id");

  if (!eventId || !/^\d+$/.test(eventId)) {
    CharityUi.showMessage(container, "No valid event was selected. Return to the event list and choose an event.", "error");
    return;
  }

  try {
    const event = await CharityApi.getEvent(eventId);
    document.title = `${event.name} | Harbour Hope`;
    container.replaceChildren(buildEventDetail(event));
    bindRegistrationDialog();
    CharityUi.refreshIcons();
  } catch (error) {
    CharityUi.showMessage(container, error.message, "error");
  }
});

function buildEventDetail(event) {
  const fragment = document.createDocumentFragment();

  const hero = document.createElement("section");
  hero.className = "event-hero";
  const image = document.createElement("img");
  image.src = event.image_path;
  image.alt = `${event.name} event artwork`;
  image.width = 1440;
  image.height = 720;
  const overlay = document.createElement("div");
  overlay.className = "event-hero__overlay container";
  const category = document.createElement("span");
  category.className = "category-label category-label--light";
  category.textContent = event.category_name;
  const title = document.createElement("h1");
  title.textContent = event.name;
  const summary = document.createElement("p");
  summary.textContent = event.summary;
  overlay.append(category, title, summary);
  hero.append(image, overlay);

  const content = document.createElement("section");
  content.className = "detail-layout container section-space";

  const main = document.createElement("div");
  main.className = "detail-main";
  main.append(
    buildHeadingSection("About this event", event.full_description),
    buildHeadingSection("Why it matters", event.purpose),
    buildProgressSection(event),
  );

  const aside = document.createElement("aside");
  aside.className = "event-sidebar";
  const facts = document.createElement("div");
  facts.className = "event-facts";
  facts.append(
    buildFact("calendar-days", "Date and time", CharityUi.formatDate(event.start_datetime)),
    buildFact("map-pin", "Location", `${event.venue_name}\n${event.address}, ${event.city}`),
    buildFact("ticket", "Ticket", CharityUi.formatMoney(event.ticket_price, event.currency)),
    buildFact("users", "Capacity", `${event.capacity} attendees`),
  );

  const registration = document.createElement("form");
  registration.className = "registration-form";
  registration.id = "registration-form";
  registration.noValidate = true;
  registration.innerHTML = `
    <h2>Register your interest</h2>
    <label for="full-name">Full name</label>
    <input id="full-name" name="fullName" type="text" autocomplete="name" placeholder="Your name">
    <label for="email">Email address</label>
    <input id="email" name="email" type="email" autocomplete="email" placeholder="you@example.com">
    <label for="tickets">Tickets</label>
    <select id="tickets" name="tickets">
      <option value="1">1 ticket</option>
      <option value="2">2 tickets</option>
      <option value="3">3 tickets</option>
      <option value="4">4 tickets</option>
    </select>
    <button class="button button--primary button--full" type="button" data-register-button>
      <i data-lucide="ticket-check"></i><span>Register</span>
    </button>
  `;
  aside.append(facts, registration);
  content.append(main, aside);

  const dialog = document.createElement("dialog");
  dialog.id = "registration-dialog";
  dialog.className = "modal";
  dialog.innerHTML = `
    <div class="modal__icon"><i data-lucide="construction"></i></div>
    <h2>Registration coming soon</h2>
    <p>This feature is currently under construction.</p>
    <button class="button button--primary" type="button" data-close-dialog>Close</button>
  `;

  fragment.append(hero, content, dialog);
  return fragment;
}

function buildHeadingSection(heading, body) {
  const section = document.createElement("section");
  section.className = "detail-section";
  const title = document.createElement("h2");
  title.textContent = heading;
  const paragraph = document.createElement("p");
  paragraph.textContent = body;
  section.append(title, paragraph);
  return section;
}

function buildFact(iconName, label, value) {
  const item = document.createElement("div");
  item.className = "event-fact";
  const icon = document.createElement("i");
  icon.setAttribute("data-lucide", iconName);
  const copy = document.createElement("div");
  const heading = document.createElement("strong");
  heading.textContent = label;
  const paragraph = document.createElement("p");
  value.split("\n").forEach((line, index) => {
    if (index) paragraph.append(document.createElement("br"));
    paragraph.append(document.createTextNode(line));
  });
  copy.append(heading, paragraph);
  item.append(icon, copy);
  return item;
}

function buildProgressSection(event) {
  const section = document.createElement("section");
  section.className = "detail-section progress-section";
  const headingRow = document.createElement("div");
  headingRow.className = "progress-heading";
  const heading = document.createElement("h2");
  heading.textContent = "Fundraising progress";
  const percent = document.createElement("strong");
  percent.textContent = `${event.progress_percentage}%`;
  headingRow.append(heading, percent);

  const bar = document.createElement("div");
  bar.className = "progress-bar";
  bar.setAttribute("role", "progressbar");
  bar.setAttribute("aria-valuenow", String(event.progress_percentage));
  bar.setAttribute("aria-valuemin", "0");
  bar.setAttribute("aria-valuemax", "100");
  bar.setAttribute("aria-label", "Fundraising progress");
  const fill = document.createElement("span");
  fill.style.width = `${Math.min(100, Number(event.progress_percentage))}%`;
  bar.append(fill);

  const figures = document.createElement("p");
  figures.className = "progress-figures";
  figures.textContent = `${CharityUi.formatMoney(event.amount_raised, event.currency)} raised of ${CharityUi.formatMoney(event.fundraising_goal, event.currency)} goal`;
  section.append(headingRow, bar, figures);
  return section;
}

function bindRegistrationDialog() {
  const dialog = document.querySelector("#registration-dialog");
  document.querySelector("[data-register-button]")?.addEventListener("click", () => dialog.showModal());
  document.querySelector("[data-close-dialog]")?.addEventListener("click", () => dialog.close());
  dialog.addEventListener("click", (event) => {
    if (event.target === dialog) dialog.close();
  });
}
