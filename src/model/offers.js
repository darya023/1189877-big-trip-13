import Observer from "../utils/observer.js";

export default class Offers extends Observer {
  constructor() {
    super();
    this._offers = null;
  }

  setOffers(offers) {
    this._offers = offers;
  }

  getOffers(currentWaypointName, isForModel) {
    let offers = this._offers.filter((currentOffers) => currentOffers.typeName.toLowerCase() === currentWaypointName.toLowerCase())[0].offers;

    if (!isForModel) {
      for (const offer of offers) {
        offer.checked = false;
      }
    }

    return offers;
  }

  static adaptToClient(offers) {
    const adaptedOffers = Object.assign(
        {},
        offers,
        {
          offers: offers.offers.map((offer) => {
            return Object.assign(
                {},
                offer,
                {
                  name: offer.title,
                  value: offer.title.toLowerCase().replace(/[^a-zA-Z ]/gi, ``).split(` `).join(`-`),
                  checked: false
                }
            );
          }),
          typeName: offers.type,
        }
    );

    adaptedOffers.offers.forEach((adaptedOffer) => {
      delete adaptedOffer.title;
    });
    delete adaptedOffers.type;

    return adaptedOffers;
  }
}
