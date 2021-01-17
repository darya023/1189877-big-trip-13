import Smart from "./smart.js";
import {TYPES} from "../const.js";
import {WAYPOINT_FORM_DEFAULT} from "../const.js";
import {humanizeDate, update} from "../utils/utils.js";
import flatpickr from "flatpickr";

import "../../node_modules/flatpickr/dist/flatpickr.min.css";

const createWaypointDropdown = () => {
  const result = [];

  for (const type of TYPES) {
    const elem = `<div class="event__type-item">
    <input id="event-type-${type.toLowerCase()}-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="${type.toLowerCase()}">
    <label class="event__type-label  event__type-label--${type.toLowerCase()}" for="event-type-${type.toLowerCase()}-1">${type}</label>
    </div>`;

    result.push(elem);
  }

  return result.join(``);
};

const createDestinationsDropdown = (destinations) => {
  const result = [];

  for (const destination of destinations) {
    const elem = `<option value="${destination}"></option>`;

    result.push(elem);
  }

  return result.join(``);
};

const createOffers = (offers, isDisabled) => {
  const result = [];

  for (const offer of offers) {
    const elem = `<div class="event__offer-selector">
        <input 
          class="event__offer-checkbox  
          visually-hidden" 
          id="event-offer-${offer.value}-1" 
          type="checkbox" 
          name="event-offer-${offer.value}"
          ${offer.checked ? ` checked` : ``}
          ${isDisabled ? ` disabled` : ``}
        >
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

const createWaypointOffersTemplate = (offers, isDisabled) => {
  if (offers.some(Boolean)) {
    const createdOffers = createOffers(offers, isDisabled);

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
    const elem = `<img class="event__photo" src="${photo.url}" alt="${photo.alt}" loading="lazy">`;

    result.push(elem);
  }

  return result.join(``);
};

const createWaypointDestinationTemplate = (destination) => {
  const {description, photos = []} = destination;

  if (description || photos.some(Boolean)) {
    const waypointDescription = createDescription(description);
    const waypointPhotos = createPhotos(photos);

    return `<section class="event__section  event__section--destination">
      <h3 class="event__section-title  event__section-title--destination">Destination</h3>
      ${waypointDescription}
      ${waypointPhotos}
    </section>`;
  }

  return ``;
};

const getButtonResetText = (isDeleting, isCreateForm) => {
  if (isDeleting) {
    return `Deleting...`;
  } else if (isCreateForm) {
    return `Cancel`;
  }

  return `Delete`;
};

const createWaypointFormTemplate = (waypoint, isCreateForm, destinations) => {
  const {
    type,
    destination,
    startDate,
    endDate,
    price,
    offers,
    isDisabled,
    isSaving,
    isDeleting
  } = waypoint;

  let startTime = humanizeDate(startDate, `DD/MM/YY HH:mm`);
  let endTime = humanizeDate(endDate, `DD/MM/YY HH:mm`);
  const waypointDropdown = createWaypointDropdown();
  const destinationDropdown = createDestinationsDropdown(destinations);
  const offersTemplate = createWaypointOffersTemplate(offers, isDisabled);
  const destinationsTemplate = createWaypointDestinationTemplate(destination);
  const buttonResetText = getButtonResetText(isDeleting, isCreateForm);

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
        <input class="event__type-toggle  visually-hidden" id="event-type-toggle-1" type="checkbox" ${isDisabled ? ` disabled` : ``}>

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
        <input 
          class="event__input  event__input--destination" 
          id="event-destination-1" 
          type="text" 
          name="event-destination" 
          value="${destination.name}" 
          list="destination-list-1"
          ${isDisabled ? ` disabled` : ``}
        >
        <datalist id="destination-list-1">
          ${destinationDropdown}
        </datalist>
      </div>

      <div class="event__field-group  event__field-group--time">
        <label class="visually-hidden" for="event-start-time-1">From</label>
        <input
          class="event__input event__input--time"
          id="event-start-time-1"
          type="text"
          name="event-start-time"
          value="${startTime}"
          ${isDisabled ? ` disabled` : ``}
        >
        &mdash;
        <label class="visually-hidden" for="event-end-time-1">To</label>
        <input
          class="event__input event__input--time"
          id="event-end-time-1"
          type="text"
          name="event-end-time"
          value="${endTime}"
          ${isDisabled ? ` disabled` : ``}
        >
      </div>

      <div class="event__field-group  event__field-group--price">
        <label class="event__label" for="event-price-1">
          <span class="visually-hidden">Price</span>
          &euro;
        </label>
        <input 
          class="event__input event__input--price"
          id="event-price-1"
          type="number"
          name="event-price"
          min="0"
          value="${price}"
          ${isDisabled ? ` disabled` : ``}
        >
      </div>

      <button class="event__save-btn  btn  btn--blue" type="submit" ${isDisabled ? ` disabled` : ``} >
        ${isSaving ? `Saving...` : `Save`}
      </button>
      <button class="event__reset-btn" type="reset" ${isDisabled ? ` disabled` : ``}>
        ${buttonResetText}
      </button>
      ${isCreateForm ? `` : `
      <button class="event__rollup-btn" type="button">
        <span class="visually-hidden">Open event</span>
      </button>
      `}
    </header>
    <section class="event__details">
      ${offersTemplate}
      ${destinationsTemplate}
    </section>
  </form>
</li>`;
};

export default class WaypointForm extends Smart {
  constructor(offersModel, destinationsModel, isCreateForm, waypointForm = WAYPOINT_FORM_DEFAULT) {
    super();
    this._data = waypointForm;
    this._startDatepicker = null;
    this._endDatepicker = null;
    this._offersModel = offersModel;
    this._destinationsModel = destinationsModel;
    this._isCreateForm = isCreateForm;

    if (this._data === WAYPOINT_FORM_DEFAULT) {
      this._data.offers = offersModel.getOffers(this._data.type.name);
    }

    this._formSubmitHandler = this._formSubmitHandler.bind(this);
    this._formDeleteHandler = this._formDeleteHandler.bind(this);
    this._waypointTypeChangeHandler = this._waypointTypeChangeHandler.bind(this);
    this._waypointOfferCheckedHandler = this._waypointOfferCheckedHandler.bind(this);
    this._waypointDestinationChangeHandler = this._waypointDestinationChangeHandler.bind(this);
    this._waypointPriceChangeHandler = this._waypointPriceChangeHandler.bind(this);
    this._waypointStartDateChangeHandler = this._waypointStartDateChangeHandler.bind(this);
    this._waypointEndDateChangeHandler = this._waypointEndDateChangeHandler.bind(this);

    if (!this._isCreateForm) {
      this._formRollupClickHandler = this._formRollupClickHandler.bind(this);
    }

    this._setInnerHandlers();
    this._initDatepickers();
  }

  getTemplate() {
    return createWaypointFormTemplate(this._data, this._isCreateForm, this._destinationsModel.getDestinations());
  }

  reset(waypoint) {
    this.updateData(
        waypoint
    );
  }

  removeElement() {
    super.removeElement();

    this._destroyDatepicker(`_startDatepicker`);
    this._destroyDatepicker(`_endDatepicker`);
  }

  restoreHandlers() {
    this._setInnerHandlers();
    this._initDatepickers();
    this.setFormSubmitHandler(this._callback.formSubmit);
    this.setFormDeleteHandler(this._callback.formDelete);

    if (!this._isCreateForm) {
      this.setFormRollupClickHandler(this._callback.formClick);
    }
  }

  _initDatepickers() {
    this._destroyDatepicker(`_startDatepicker`);
    this._destroyDatepicker(`_endDatepicker`);

    const waypointStartDateInput = this._getChildElement(`[name="event-start-time"]`);
    const waypointEndDateInput = this._getChildElement(`[name="event-end-time"]`);

    this._startDatepicker = flatpickr(
        waypointStartDateInput,
        {
          "enableTime": true,
          "time_24hr": true,
          "dateFormat": `d/m/y H:i`,
          "minuteIncrement": 1,
          "onChange": this._waypointStartDateChangeHandler,
        }
    );

    this._endDatepicker = flatpickr(
        waypointEndDateInput,
        {
          "enableTime": true,
          "time_24hr": true,
          "dateFormat": `d/m/y H:i`,
          "minuteIncrement": 1,
          "minDate": waypointStartDateInput.value,
          "onChange": this._waypointEndDateChangeHandler,
        }
    );
  }

  _destroyDatepicker(datepicker) {
    if (this[datepicker]) {
      this[datepicker].destroy();
      this[datepicker] = null;
    }
  }

  _waypointStartDateChangeHandler([selectedDate]) {
    const prevEndDate = this._endDatepicker.parseDate(this._endDatepicker.input.value);

    this.updateData(
        {
          startDate: selectedDate,
        },
        true
    );
    this._endDatepicker.set(`minDate`, humanizeDate(selectedDate, `DD/MM/YY HH:mm`));

    if (selectedDate > prevEndDate) {
      this._endDatepicker.setDate(humanizeDate(selectedDate, `DD/MM/YY HH:mm`));
      this._waypointEndDateChangeHandler([selectedDate]);
    }
  }

  _waypointEndDateChangeHandler([selectedDate]) {
    this.updateData(
        {
          endDate: selectedDate,
        },
        true
    );
  }

  _setInnerHandlers() {
    const waypointTypeInputs = this._getChildElements(`.event__type-input`);
    const waypointOffersInputs = this._getChildElements(`.event__offer-checkbox`);
    const waypointDestinationInput = this._getChildElement(`.event__input--destination`);
    const waypointPriceInput = this._getChildElement(`.event__input--price`);

    waypointTypeInputs.forEach((waypointType) => {
      waypointType.addEventListener(`click`, this._waypointTypeChangeHandler);
    });
    waypointOffersInputs.forEach((waypointOffer) => {
      waypointOffer.addEventListener(`click`, this._waypointOfferCheckedHandler);
    });
    waypointDestinationInput.addEventListener(`change`, this._waypointDestinationChangeHandler);
    waypointPriceInput.addEventListener(`change`, this._waypointPriceChangeHandler);
  }

  _getChildElement(selector) {
    return this.getElement().querySelector(selector);
  }

  _getChildElements(selector) {
    return this.getElement().querySelectorAll(selector);
  }

  _formSubmitHandler(event) {
    event.preventDefault();
    this._callback.formSubmit(this._data);
  }

  _formRollupClickHandler() {
    this._callback.formClick();
  }

  _formDeleteHandler(event) {
    event.preventDefault();
    this._callback.formDelete(this._data);
  }

  _waypointTypeChangeHandler(event) {
    this.updateData(
        {
          type: {
            name: event.target.value,
            img: {
              url: `img/icons/${event.target.value}.png`,
              alt: `Event type icon`,
            },
          },
          offers: this._offersModel.getOffers(event.target.value)
        }
    );
  }

  _waypointDestinationChangeHandler(event) {
    const destination = event.target.value;

    if (this._destinationsModel.getDestination(destination) !== undefined) {
      this.updateData({
        destination: this._destinationsModel.getDestination(destination)
      });
    } else {
      this.updateData({
        destination: {
          name: destination
        }
      });
    }
  }

  _waypointPriceChangeHandler(event) {
    this.updateData(
        {price: Number(event.target.value)},
        true
    );
  }

  _waypointOfferCheckedHandler(event) {
    const element = event.target.parentElement;
    const index = [...element.parentElement.children].indexOf(element);

    this.updateData({
      offers: update(
          this._data.offers,
          Object.assign(
              {},
              this._data.offers[index],
              {checked: event.target.checked}
          ),
          index
      )
    });
  }

  setFormSubmitHandler(callback) {
    const form = this.getElement().querySelector(`form`);

    this._callback.formSubmit = callback;
    form.addEventListener(`submit`, this._formSubmitHandler);
  }

  setFormRollupClickHandler(callback) {
    const rollupButton = this._getChildElement(`.event__rollup-btn`);

    this._callback.formClick = callback;
    rollupButton.addEventListener(`click`, this._formRollupClickHandler);
  }

  setFormDeleteHandler(callback) {
    const deleteButton = this._getChildElement(`.event__reset-btn`);

    this._callback.formDelete = callback;
    deleteButton.addEventListener(`click`, this._formDeleteHandler);
  }
}
