export const createSiteMsgTemplate = (waypoints) => {
  let msg = ``;

  if (!waypoints.some(Boolean)) {
    msg = `Click New Event to create your first point`;
  }

  return `<p class="trip-events__msg">${msg}</p>`;
};
