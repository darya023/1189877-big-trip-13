import {humanizeDate, createElement} from "../utils.js";

const createTitle = (names) => {
  if (names.length <= 3) {
    return names.join(` &mdash; `);
  }

  const lastIndex = names.length - 1;
  const result = names[0] + ` &mdash; ... &mdash; ` + names[lastIndex];
  return result;
};

const createDate = (startDate, endDate) => {
  const startMonth = startDate.getMonth();
  const endMonth = endDate.getMonth();

  if (startMonth !== endMonth) {
    return humanizeDate(startDate, `MMM DD`) + `&nbsp;&mdash;&nbsp;` + humanizeDate(endDate, `MMM DD`);
  }

  return humanizeDate(startDate, `MMM DD`) + `&nbsp;&mdash;&nbsp;` + humanizeDate(endDate, `DD`);
};

const createTotalPrice = (prices, offers) => {
  const price = prices.reduce((sum, current) => sum + current, 0);
  const offersPrice = offers.reduce((sum, current) => {
    let result = current.price;

    if (!current.checked) {
      result = 0;
    }

    return sum + result;
  }, 0);

  const result = price + offersPrice;

  return result;
};

const createTripInfoTemplate = (waypoints) => {
  if (!waypoints.some(Boolean)) {
    return ``;
  }

  let sortByDateWaypoints = waypoints.slice();

  sortByDateWaypoints.sort((a, b) => a.startDate - b.startDate);

  const startDate = sortByDateWaypoints[0].startDate;
  const endDate = sortByDateWaypoints[sortByDateWaypoints.length - 1].endDate;

  let names = [];
  let prices = [];
  let offers = [];

  for (const waypoint of sortByDateWaypoints) {
    names.push(waypoint.destination.name);
    prices.push(waypoint.price);
    for (const offer of waypoint.offers) {
      offers.push(offer);
    }
  }

  const title = createTitle(names);
  const date = createDate(startDate, endDate);
  const totalPrice = createTotalPrice(prices, offers);

  return `<section class="trip-main__trip-info  trip-info">
    <div class="trip-info__main">
      <h1 class="trip-info__title">${title}</h1>

      <p class="trip-info__dates">${date}</p>
    </div>

    <p class="trip-info__cost">
      Total: &euro;&nbsp;<span class="trip-info__cost-value">${totalPrice}</span>
    </p>
  </section>`;
};

export default class TripInfo {
  constructor(waypoints = []) {
    this._waypoints = waypoints;
    this._element = null;
  }

  getTemplate() {
    return createTripInfoTemplate(this._waypoints);
  }

  getElement() {
    if (!this._element) {
      this._element = createElement(this.getTemplate());
    }

    return this._element;
  }

  removeElement() {
    this._element = null;
  }
}
