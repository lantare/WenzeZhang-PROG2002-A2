document.addEventListener("DOMContentLoaded", async () => {
  const upcomingGrid = document.querySelector("#upcoming-events");
  const pastGrid = document.querySelector("#past-events");
  const organizationMission = document.querySelector("#organization-mission");
  const organizationContact = document.querySelector("#organization-contact");

  try {
    const [organization, events] = await Promise.all([
      CharityApi.getOrganization(),
      CharityApi.getEvents(true),
    ]);

    organizationMission.textContent = organization.mission;
    organizationContact.textContent = `${organization.email} | ${organization.phone}`;

    const upcoming = events.filter((event) => event.temporal_status === "upcoming");
    const past = events.filter((event) => event.temporal_status === "past").slice(-3).reverse();

    upcomingGrid.replaceChildren(...upcoming.map(CharityUi.createEventCard));
    if (past.length > 0) {
      pastGrid.replaceChildren(...past.map(CharityUi.createEventCard));
    } else {
      CharityUi.showMessage(pastGrid, "Past event highlights will appear here after events are completed.");
    }

    document.querySelector("#event-count").textContent = String(upcoming.length);
    const totalRaised = events.reduce((sum, event) => sum + Number(event.amount_raised), 0);
    document.querySelector("#raised-total").textContent = CharityUi.formatMoney(totalRaised);
    CharityUi.refreshIcons();
  } catch (error) {
    CharityUi.showMessage(upcomingGrid, error.message, "error");
    CharityUi.showMessage(pastGrid, "Past events are unavailable until the API reconnects.", "error");
  }
});
