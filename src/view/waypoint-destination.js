import {WAYPOINT_FORM_DEFAULT} from "../const.js";
import {createElement} from "../utils.js";

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

export default class WaypointDestination {
  constructor(destination = WAYPOINT_FORM_DEFAULT.destination) {
    this._destination = destination;
    this._element = null;
  }

  getTemplate() {
    return createWaypointDestinationTemplate(this._destination);
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
