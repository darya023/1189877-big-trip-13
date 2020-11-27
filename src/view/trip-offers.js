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

export const createWaypointOffersTemplate = (waypoint) => {
  const {type: {offers}} = waypoint;

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
