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


const createWaypointFormTemplate = (waypoint) => {
  const {type, destination, startDate, endDate, price} = waypoint;

  let startTime = humanizeDate(startDate, `DD/MM/YY HH:mm`);
  let endTime = humanizeDate(endDate, `DD/MM/YY HH:mm`);
  const waypointDropdown = createWaypointDropdown();
  const destinationDropdown = createDestinationsDropdown();

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
    <section class="event__details"></section>
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
  
  getRollupButton() {
    return this._rollupButton;
  }
  
  getWaypointDetails() {
    return this._waypointDetails;
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
