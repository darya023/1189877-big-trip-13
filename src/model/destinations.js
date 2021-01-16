import Observer from "../utils/observer.js";

export default class Destination extends Observer {
  constructor() {
    super();
    this._destinations = [];
  }

  setDestinations(destinations) {
    this._destinations = destinations;
  }

  getDestination(currentDestinationName) {
    const currentDestination = this._destinations.filter((destination) => destination.name.toLowerCase() === currentDestinationName.toLowerCase())[0];

    return currentDestination;
  }

  getDestinations() {
    const destinations = this._destinations.map((destination) => destination.name);

    return destinations;
  }

  static adaptToClient(destination) {
    const adaptedDestination = Object.assign(
        {},
        destination,
        {
          photos: destination.pictures.map((photo) => {
            return Object.assign(
                {},
                {
                  url: photo.src,
                  alt: photo.description,
                }
            );
          })
        }
    );

    delete adaptedDestination.pictures;

    return adaptedDestination;
  }
}
