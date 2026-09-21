(function exposeApi(global) {
  const baseUrl = global.APP_CONFIG.API_BASE_URL.replace(/\/$/, "");

  async function request(path) {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 10000);

    try {
      const response = await fetch(`${baseUrl}${path}`, {
        headers: { Accept: "application/json" },
        signal: controller.signal,
      });
      const payload = await response.json().catch(() => ({}));
      if (!response.ok) {
        throw new Error(payload.error?.message || `Request failed with status ${response.status}.`);
      }
      return payload.data;
    } catch (error) {
      if (error.name === "AbortError") {
        throw new Error("The request timed out. Check that the API server is running.");
      }
      if (error instanceof TypeError) {
        throw new Error("Could not contact the API. Start the API on http://localhost:3000 and try again.");
      }
      throw error;
    } finally {
      clearTimeout(timeout);
    }
  }

  global.CharityApi = {
    getOrganization: () => request("/organization"),
    getEvents: (includePast = false) => request(`/events?includePast=${includePast}`),
    getCategories: () => request("/categories"),
    getEvent: (id) => request(`/events/${encodeURIComponent(id)}`),
    searchEvents: (filters) => {
      const query = new URLSearchParams();
      Object.entries(filters).forEach(([key, value]) => {
        if (value) query.set(key, value);
      });
      return request(`/events/search?${query.toString()}`);
    },
  };
}(window));
