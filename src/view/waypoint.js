import AbstractView from "./abstract.js";
import {humanizeDate} from "../utils/utils.js";
import dayjs from "dayjs";
import duration from "dayjs/plugin/duration";
import he from "he";

dayjs.extend(duration);

const getDurationTime = (time) => {
  const days = time.days();
  const hours = time.hours();
  const minutes = time.minutes();
  const date = [
    {
      name: `days`,
      value: days,
      format: `D`
    },
    {
      name: `hours`,
      value: hours,
      format: `H`
    },
    {
      name: `minutes`,
      value: minutes,
      format: `M`
    },
  ];

  const formattingLenght = 2;
  const durationTimeItems = [];

  for (const item of date) {
    const value = item.value;
    const format = item.format;

    if (value) {
      const elem = `0` + value;
      const formattedElem = elem.slice(elem.length - formattingLenght) + format;

      durationTimeItems.push(formattedElem);
    }
  }

  return durationTimeItems.join(` `);
};

const createOffers = (offers) => {
  const offersMarkup = [];

  for (const offer of offers) {
    if (offer.checked) {
      const elem = `<li class="event__offer">
        <span class="event__offer-title">${offer.name}</span>
        &plus;&euro;&nbsp;
        <span class="event__offer-price">${offer.price}</span>
      </li>`;

      offersMarkup.push(elem);
    }
  }

  return offersMarkup.join(``);
};


const createWaypointTemplate = (waypoint) => {

  const {startDate, endDate, price, type, offers, destination, isFavorite} = waypoint;

  const startDay = humanizeDate(startDate, `MMM DD`);
  const startDatetime = humanizeDate(startDate, `YYYY-MM-DD`);
  const startTime = humanizeDate(startDate, `HH:mm`);
  const startFullDate = humanizeDate(startDate, `YYYY-MM-DDTHH:mm`);
  const endTime = humanizeDate(endDate, `HH:mm`);
  const endFullDate = humanizeDate(endDate, `YYYY-MM-DDTHH:mm`);

  const time = dayjs.duration(endDate - startDate);
  const durationTime = getDurationTime(time);
  const createdOffers = createOffers(offers);

  return `<li class="trip-events__item">
  <div class="event">
    <time class="event__date" datetime="${startDatetime}">${startDay}</time>
    <div class="event__type">
      <img class="event__type-icon" width="42" height="42" src="${type.img.url}" alt="${type.img.alt}">
    </div>
    <h3 class="event__title">${type.name} ${he.encode(String(destination.name))}</h3>
    <div class="event__schedule">
      <p class="event__time">
        <time class="event__start-time" datetime="${startFullDate}">${startTime}</time>
        &mdash;
        <time class="event__end-time" datetime="${endFullDate}">${endTime}</time>
      </p>
      <p class="event__duration">${durationTime}</p>
    </div>
    <p class="event__price">
      &euro;&nbsp;<span class="event__price-value">${price}</span>
    </p>
    ${offers.some(Boolean) ? `<h4 class="visually-hidden">Offers:</h4>
    <ul class="event__selected-offers">
      ${createdOffers}
    </ul>` : ``}
    <button class="event__favorite-btn${isFavorite ? ` event__favorite-btn--active` : ``}" type="button">
      <span class="visually-hidden">Add to favorite</span>
      <svg class="event__favorite-icon" width="28" height="28" viewBox="0 0 28 28">
        <path d="M14 21l-8.22899 4.3262 1.57159-9.1631L.685209 9.67376 9.8855 8.33688 14 0l4.1145 8.33688 9.2003 1.33688-6.6574 6.48934 1.5716 9.1631L14 21z"/>
      </svg>
    </button>
    <button class="event__rollup-btn" type="button">
      <span class="visually-hidden">Open event</span>
    </button>
  </div>
</li>`;
};

export default class Waypoint extends AbstractView {
  constructor(waypoint) {
    super();
    this._waypoint = waypoint;
    this._waypointRollupClickHandler = this._waypointRollupClickHandler.bind(this);
    this._favoriteClickHandler = this._favoriteClickHandler.bind(this);
    this._rollupButton = this._getChildElement(`.event__rollup-btn`);
    this._favoriteButton = this._getChildElement(`.event__favorite-btn`);
  }

  getTemplate() {
    return createWaypointTemplate(this._waypoint);
  }

  _getChildElement(selector) {
    return this.getElement().querySelector(selector);
  }

  _waypointRollupClickHandler() {
    this._callback.waypointClick();
  }

  _favoriteClickHandler(event) {
    event.preventDefault();
    this._callback.favoriteClick();
  }

  setWaypointRollupClickHandler(callback) {
    this._callback.waypointClick = callback;
    this._rollupButton.addEventListener(`click`, this._waypointRollupClickHandler);
  }

  setFavoriteClickHandler(callback) {
    this._callback.favoriteClick = callback;
    this._favoriteButton.addEventListener(`click`, this._favoriteClickHandler);
  }
}
