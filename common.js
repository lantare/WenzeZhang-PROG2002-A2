(function exposeUi(global) {
  const dateFormatter = new Intl.DateTimeFormat("en-AU", {
    weekday: "short",
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });

  function refreshIcons() {
    if (global.lucide) global.lucide.createIcons({ attrs: { "aria-hidden": "true" } });
  }

  function formatDate(value) {
    return dateFormatter.format(new Date(value.replace(" ", "T")));
  }

  function formatMoney(value, currency = "AUD") {
    const amount = Number(value);
    if (amount === 0) return "Free";
    return new Intl.NumberFormat("en-AU", {
      style: "currency",
      currency,
      maximumFractionDigits: amount % 1 === 0 ? 0 : 2,
    }).format(amount);
  }

  function createIconText(iconName, text) {
    const wrapper = document.createElement("span");
    wrapper.className = "icon-text";
    const icon = document.createElement("i");
    icon.setAttribute("data-lucide", iconName);
    const label = document.createElement("span");
    label.textContent = text;
    wrapper.append(icon, label);
    return wrapper;
  }

  function createEventCard(event) {
    const article = document.createElement("article");
    article.className = "event-card";

    const imageLink = document.createElement("a");
    imageLink.href = `event.html?id=${event.id}`;
    imageLink.className = "event-card__image-link";
    imageLink.setAttribute("aria-label", `View ${event.name}`);
    const image = document.createElement("img");
    image.src = event.image_path;
    image.alt = `${event.name} event artwork`;
    image.width = 720;
    image.height = 480;
    image.loading = "lazy";
    imageLink.append(image);

    const body = document.createElement("div");
    body.className = "event-card__body";

    const meta = document.createElement("div");
    meta.className = "event-card__meta";
    const category = document.createElement("span");
    category.className = "category-label";
    category.textContent = event.category_name;
    const status = document.createElement("span");
    status.className = `status-label status-label--${event.temporal_status}`;
    status.textContent = event.temporal_status === "past" ? "Past event" : "Upcoming";
    meta.append(category, status);

    const title = document.createElement("h3");
    const titleLink = document.createElement("a");
    titleLink.href = `event.html?id=${event.id}`;
    titleLink.textContent = event.name;
    title.append(titleLink);

    const summary = document.createElement("p");
    summary.textContent = event.summary;

    const details = document.createElement("div");
    details.className = "event-card__details";
    details.append(
      createIconText("calendar-days", formatDate(event.start_datetime)),
      createIconText("map-pin", `${event.venue_name}, ${event.city}`),
    );

    const footer = document.createElement("div");
    footer.className = "event-card__footer";
    const price = document.createElement("strong");
    price.textContent = formatMoney(event.ticket_price, event.currency);
    const action = document.createElement("a");
    action.href = `event.html?id=${event.id}`;
    action.className = "text-link";
    action.append(document.createTextNode("View details "));
    const arrow = document.createElement("i");
    arrow.setAttribute("data-lucide", "arrow-right");
    action.append(arrow);
    footer.append(price, action);

    body.append(meta, title, summary, details, footer);
    article.append(imageLink, body);
    return article;
  }

  function showMessage(container, message, kind = "info") {
    container.replaceChildren();
    const panel = document.createElement("div");
    panel.className = `message message--${kind}`;
    panel.setAttribute("role", kind === "error" ? "alert" : "status");
    const icon = document.createElement("i");
    icon.setAttribute("data-lucide", kind === "error" ? "circle-alert" : "info");
    const text = document.createElement("p");
    text.textContent = message;
    panel.append(icon, text);
    container.append(panel);
    refreshIcons();
  }

  function initializeShell() {
    const menuButton = document.querySelector("[data-menu-button]");
    const nav = document.querySelector("[data-nav]");
    if (menuButton && nav) {
      menuButton.addEventListener("click", () => {
        const expanded = menuButton.getAttribute("aria-expanded") === "true";
        menuButton.setAttribute("aria-expanded", String(!expanded));
        nav.toggleAttribute("data-open", !expanded);
      });
    }

    const page = document.body.dataset.page;
    document.querySelector(`[data-nav-link="${page}"]`)?.setAttribute("aria-current", "page");
    document.querySelectorAll("[data-current-year]").forEach((node) => {
      node.textContent = new Date().getFullYear();
    });
    refreshIcons();
  }

  global.CharityUi = {
    createEventCard,
    formatDate,
    formatMoney,
    refreshIcons,
    showMessage,
  };

  document.addEventListener("DOMContentLoaded", initializeShell);
}(window));
