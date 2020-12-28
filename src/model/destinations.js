import Observer from "../utils/observer.js";
import {generateDestinations} from "../mock/destination.js";

export default class Destination extends Observer {
  constructor() {
    super();
    this._destinations = generateDestinations();
  }

  getDestination(currentDestinationName) {
    const currentDestination = this._destinations.filter((destination) => destination.name.toLowerCase() === currentDestinationName.toLowerCase())[0];

    return currentDestination;
  }
}
