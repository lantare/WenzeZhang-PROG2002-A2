document.addEventListener("DOMContentLoaded", async () => {
  const form = document.querySelector("#search-form");
  const categorySelect = document.querySelector("#category");
  const results = document.querySelector("#search-results");
  const summary = document.querySelector("#results-summary");
  const clearButton = document.querySelector("#clear-filters");

  function currentFilters() {
    return {
      date: form.elements.date.value,
      location: form.elements.location.value.trim(),
      category: form.elements.category.value,
    };
  }

  function hasFilter(filters) {
    return Object.values(filters).some(Boolean);
  }

  async function runSearch(filters) {
    if (!hasFilter(filters)) {
      summary.textContent = "Choose at least one filter to search.";
      CharityUi.showMessage(results, "Select a date, enter a location, or choose a category.", "error");
      return;
    }

    summary.textContent = "Searching events...";
    CharityUi.showMessage(results, "Loading matching events...");

    try {
      const events = await CharityApi.searchEvents(filters);
      const query = new URLSearchParams();
      Object.entries(filters).forEach(([key, value]) => value && query.set(key, value));
      history.replaceState(null, "", `${location.pathname}?${query.toString()}`);

      summary.textContent = `${events.length} event${events.length === 1 ? "" : "s"} found`;
      if (events.length === 0) {
        CharityUi.showMessage(results, "No events match these filters. Try a different date, location or category.");
        return;
      }
      results.replaceChildren(...events.map(CharityUi.createEventCard));
      CharityUi.refreshIcons();
    } catch (error) {
      summary.textContent = "Search unavailable";
      CharityUi.showMessage(results, error.message, "error");
    }
  }

  try {
    const categories = await CharityApi.getCategories();
    categories.forEach((category) => {
      const option = document.createElement("option");
      option.value = String(category.id);
      option.textContent = category.name;
      categorySelect.append(option);
    });

    const query = new URLSearchParams(location.search);
    form.elements.date.value = query.get("date") || "";
    form.elements.location.value = query.get("location") || "";
    form.elements.category.value = query.get("category") || "";
    const initialFilters = currentFilters();
    if (hasFilter(initialFilters)) runSearch(initialFilters);
  } catch (error) {
    CharityUi.showMessage(results, error.message, "error");
  }

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    runSearch(currentFilters());
  });

  clearButton.addEventListener("click", () => {
    form.reset();
    history.replaceState(null, "", location.pathname);
    summary.textContent = "Ready to search";
    CharityUi.showMessage(results, "Use one or more filters to find an event that suits you.");
    form.elements.date.focus();
  });
});
