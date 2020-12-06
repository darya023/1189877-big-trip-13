import AbstractView from "./abstract.js";

const createTripTemplate = () => {
  return `<ul class="trip-events__list"></ul>`;
};

export default class Trip extends AbstractView {
  getTemplate() {
    return createTripTemplate();
  }
}
