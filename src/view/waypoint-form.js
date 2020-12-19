import AbstractView from "./abstract.js";
import {TYPES} from "../const.js";
import {DESTINATIONS, WAYPOINT_FORM_DEFAULT} from "../const.js";
import {humanizeDate} from "../utils/utils.js";

const createWaypointDropdown = () => {
  let result = [];

  for (const type of TYPES) {
    const elem = `<div class="event__type-item">
    <input id="event-type-${type.toLowerCase()}-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="${type.toLowerCase()}">
    <label class="event__type-label  event__type-label--${type.toLowerCase()}" for="event-type-${type.toLowerCase()}-1">${type}</label>
    </div>`;

    result.push(elem);
  }

  return result.join(``);
};

const createDestinationsDropdown = () => {
  let result = [];

  for (const destination of DESTINATIONS) {
    const elem = `<option value="${destination}"></option>`;

    result.push(elem);
  }

  return result.join(``);
};

const createOffers = (offers) => {
  let result = [];

  for (const offer of offers) {
    const elem = `<div class="event__offer-selector">
        <input class="event__offer-checkbox  visually-hidden" id="event-offer-${offer.value}-1" type="checkbox" name="event-offer-${offer.value}"${offer.checked ? ` checked` : ``}>
        <label class="event__offer-label" for="event-offer-${offer.value}-1">
          <span class="event__offer-title">${offer.name}</span>
          &plus;&euro;&nbsp;
          <span class="event__offer-price">${offer.price}</span>
        </label>
      </div>`;

    result.push(elem);
  }

  return result.join(``);
};

const createWaypointOffersTemplate = (offers) => {

  console.log(offers);
  if (offers.some(Boolean)) {
    const createdOffers = createOffers(offers);

    return `<section class="event__section  event__section--offers">
      <h3 class="event__section-title  event__section-title--offers">Offers</h3>
  
      <div class="event__available-offers">
        ${createdOffers}
      </div>
    </section>`;
  }

  return ``;
};

const createDescription = (description) => {
  if (description) {
    return `<p class="event__destination-description">${description}</p>`;
  }

  return ``;
};

const createPhotos = (photos) => {
  if (photos.some(Boolean)) {
    const photo = createPhoto(photos);

    return `<div class="event__photos-container">
      <div class="event__photos-tape">
        ${photo}
      </div>
    </div>`;
  }

  return ``;
};

const createPhoto = (photos) => {
  let result = [];

  for (const photo of photos) {
    const elem = `<img class="event__photo" src="${photo.url}" alt="${photo.alt}">`;

    result.push(elem);
  }

  return result.join(``);
};

const createWaypointDestinationTemplate = (destination) => {
  const {description, photos} = destination;
  const waypointDescription = createDescription(description);
  const waypointPhotos = createPhotos(photos);

  if (description || photos.some(Boolean)) {
    return `<section class="event__section  event__section--destination">
      <h3 class="event__section-title  event__section-title--destination">Destination</h3>
      ${waypointDescription}
      ${waypointPhotos}
    </section>`;
  }

  return ``;
};

const createWaypointFormTemplate = (waypoint) => {
  const {type, destination, startDate, endDate, price, offers} = waypoint;

  let startTime = humanizeDate(startDate, `DD/MM/YY HH:mm`);
  let endTime = humanizeDate(endDate, `DD/MM/YY HH:mm`);
  const waypointDropdown = createWaypointDropdown();
  const destinationDropdown = createDestinationsDropdown();
  const offersTemplate = createWaypointOffersTemplate(offers);
  const destinationsTemplate = createWaypointDestinationTemplate(destination);

  if (startDate === ``) {
    startTime = ``;
  }
  if (endDate === ``) {
    endTime = ``;
  }

  return `<li class="trip-events__item">
  <form class="event event--edit" action="#" method="post">
    <header class="event__header">
      <div class="event__type-wrapper">
        <label class="event__type  event__type-btn" for="event-type-toggle-1">
          <span class="visually-hidden">Choose event type</span>
          <img class="event__type-icon" width="17" height="17" src="${type.img.url}" alt="${type.img.alt}">
        </label>
        <input class="event__type-toggle  visually-hidden" id="event-type-toggle-1" type="checkbox">

        <div class="event__type-list">
          <fieldset class="event__type-group">
            <legend class="visually-hidden">Event type</legend>
            ${waypointDropdown}
          </fieldset>
        </div>
      </div>

      <div class="event__field-group  event__field-group--destination">
        <label class="event__label  event__type-output" for="event-destination-1">
          ${type.name}
        </label>
        <input class="event__input  event__input--destination" id="event-destination-1" type="text" name="event-destination" value="${destination.name}" list="destination-list-1">
        <datalist id="destination-list-1">
          ${destinationDropdown}
        </datalist>
      </div>

      <div class="event__field-group  event__field-group--time">
        <label class="visually-hidden" for="event-start-time-1">From</label>
        <input class="event__input  event__input--time" id="event-start-time-1" type="text" name="event-start-time" value="${startTime}">
        &mdash;
        <label class="visually-hidden" for="event-end-time-1">To</label>
        <input class="event__input  event__input--time" id="event-end-time-1" type="text" name="event-end-time" value="${endTime}">
      </div>

      <div class="event__field-group  event__field-group--price">
        <label class="event__label" for="event-price-1">
          <span class="visually-hidden">Price</span>
          &euro;
        </label>
        <input class="event__input  event__input--price" id="event-price-1" type="text" name="event-price" value="${price}">
      </div>

      <button class="event__save-btn  btn  btn--blue" type="submit">Save</button>
      <button class="event__reset-btn" type="reset">Delete</button>
      <button class="event__rollup-btn" type="button">
        <span class="visually-hidden">Open event</span>
      </button>
    </header>
    <section class="event__details">
      ${offersTemplate}
      ${destinationsTemplate}
    </section>
  </form>
</li>`;
};

export default class WaypointForm extends AbstractView {
  constructor(waypointForm = WAYPOINT_FORM_DEFAULT) {
    super();
    this._waypointForm = waypointForm;
    this._element = null;
    this._formSubmitHandler = this._formSubmitHandler.bind(this);
    this._formClickHandler = this._formClickHandler.bind(this);
    this._rollupButton = this._getChildElement(`.event__rollup-btn`);
    this._waypointDetails = this._getChildElement(`.event__details`);
  }

  getTemplate() {
    return createWaypointFormTemplate(this._waypointForm);
  }

  _getChildElement(selector) {
    return this.getElement().querySelector(selector);
  }

  _formSubmitHandler(event) {
    event.preventDefault();
    this._callback.formSubmit();
  }

  _formClickHandler() {
    this._callback.formClick();
  }

  setFormSubmitHandler(callback) {
    const form = this.getElement().querySelector(`form`);

    this._callback.formSubmit = callback;
    form.addEventListener(`submit`, this._formSubmitHandler);
  }

  setFormClickHandler(callback) {
    this._callback.formClick = callback;
    this._rollupButton.addEventListener(`click`, this._formClickHandler);
  }
}
