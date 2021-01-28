import AbstractView from "./abstract.js";
import {humanizeDate} from "../utils/utils.js";

const createTitle = (names) => {
  if (names.length <= 3) {
    return names.join(` &mdash; `);
  }

  const lastIndex = names.length - 1;
  const result = `${names[0]} &mdash; ... &mdash; ${names[lastIndex]}`;
  return result;
};

const formatDate = (startDate, endDate, startDateFormat, endDateFormat) => {
  return `${humanizeDate(startDate, startDateFormat)} &nbsp;&mdash;&nbsp; ${humanizeDate(endDate, endDateFormat)}`;
};

const createDate = (startDate, endDate) => {
  const startMonth = startDate.getMonth();
  const endMonth = endDate.getMonth();

  if (startMonth !== endMonth) {
    return formatDate(startDate, endDate, `MMM DD`, `MMM DD`);
  }

  return formatDate(startDate, endDate, `MMM DD`, `DD`);
};

const createTotalPrice = (prices, offers) => {
  const price = prices.reduce((sum, current) => Number(sum) + Number(current), 0);
  const offersPrice = offers.reduce((sum, current) => {
    let result = current.price;

    if (!current.checked) {
      result = 0;
    }

    return Number(sum) + Number(result);
  }, 0);

  const result = Number(price) + Number(offersPrice);

  return result;
};

const createTripInfoTemplate = (waypoints) => {
  const sortByDateWaypoints = waypoints.slice();

  sortByDateWaypoints.sort((a, b) => a.startDate - b.startDate);

  const startDate = sortByDateWaypoints[0].startDate;
  const endDate = sortByDateWaypoints[sortByDateWaypoints.length - 1].endDate;

  const names = [];
  const prices = [];
  const offers = [];

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

export default class TripInfo extends AbstractView {
  constructor(waypoints) {
    super();
    this._waypoints = waypoints;
  }

  getTemplate() {
    return createTripInfoTemplate(this._waypoints);
  }
}
