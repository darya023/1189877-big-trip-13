import Observer from "../utils/observer.js";
import {generateOffers} from "../mock/offers.js";

export default class Offers extends Observer {
  constructor() {
    super();
    this._offers = generateOffers();
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
}
