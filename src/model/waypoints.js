import Observer from "../utils/observer.js";

export default class Waypoints extends Observer {
  constructor() {
    super();
    this._waypoints = [];
  }

  getWaypoints() {
    return this._waypoints;
  }

  setWaypoints(updateType, waypoints) {
    this._waypoints = waypoints.slice();
    this._notify(updateType);
  }

  updateWaypoint(updateType, updatedWaypoint) {
    const index = this._waypoints.findIndex((item) => item.id === updatedWaypoint.id);

    if (index === -1) {
      throw new Error(`Can't update unexisting waypoint`);
    }

    this._waypoints = [
      ...this._waypoints.slice(0, index),
      updatedWaypoint,
      ...this._waypoints.slice(index + 1)
    ];

    this._notify(updateType, updatedWaypoint);
  }

  deleteWaypoint(updateType, updatedWaypoint) {
    const index = this._waypoints.findIndex((item) => item.id === updatedWaypoint.id);

    if (index === -1) {
      throw new Error(`Can't delete unexisting waypoint`);
    }

    this._waypoints = [
      ...this._waypoints.slice(0, index),
      ...this._waypoints.slice(index + 1)
    ];

    this._notify(updateType, updatedWaypoint);
  }

  addWaypoint(updateType, updatedWaypoint) {
    this._waypoints = [
      updatedWaypoint,
      ...this._waypoints
    ];

    this._notify(updateType, updatedWaypoint);
  }

  static adaptToClient(waypoint) {
    const adaptedDestination = Object.assign(
        {},
        waypoint.destination,
        {
          photos: waypoint.destination.pictures.map((photo) => {
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

    const adaptedWaypoint = Object.assign(
        {},
        waypoint,
        {
          price: waypoint.base_price,
          startDate: new Date(waypoint.date_from),
          endDate: new Date(waypoint.date_to),
          isFavorite: waypoint.is_favorite,
          type: {
            name: waypoint.type,
            img: {
              alt: `Event type icon`,
              url: `img/icons/${waypoint.type}.png`
            }
          },
          destination: adaptedDestination,
          offers: waypoint.offers.map((offer) => {
            return Object.assign(
                {},
                offer,
                {
                  name: offer.title,
                  value: offer.title.toLowerCase().replace(/[^a-zA-Z ]/gi, ``).split(` `).join(`-`),
                  checked: true
                }
            );
          })
        }
    );

    delete adaptedWaypoint.base_price;
    delete adaptedWaypoint.date_from;
    delete adaptedWaypoint.date_to;
    delete adaptedWaypoint.is_favorite;
    delete adaptedWaypoint.destination.pictures;
    adaptedWaypoint.offers.forEach((adaptedOffer) => {
      delete adaptedOffer.title;
    });

    return adaptedWaypoint;
  }

  static adaptToServer(waypoint) {
    const adaptedDestination = Object.assign(
        {},
        waypoint.destination,
        {
          pictures: waypoint.destination.photos.map((photo) => {
            return Object.assign(
                {},
                {
                  src: photo.url,
                  description: photo.alt,
                }
            );
          })
        }
    );

    const adaptedWaypoint = Object.assign(
        {},
        waypoint,
        {
          "base_price": waypoint.price,
          "date_from": waypoint.startDate.toISOString(),
          "date_to": waypoint.endDate.toISOString(),
          "is_favorite": waypoint.isFavorite,
          "type": waypoint.type.name,
          "destination": adaptedDestination,
          "offers": waypoint.offers.map((offer) => {
            return Object.assign(
                {},
                offer,
                {
                  title: offer.name,
                }
            );
          })
        }
    );

    delete adaptedWaypoint.price;
    delete adaptedWaypoint.startDate;
    delete adaptedWaypoint.endDate;
    delete adaptedWaypoint.isFavorite;
    delete adaptedWaypoint.destination.photos;

    for (let i = adaptedWaypoint.offers.length - 1; i >= 0; i--) {
      const adaptedOffer = adaptedWaypoint.offers[i];

      if (!adaptedOffer.checked) {
        adaptedWaypoint.offers.splice(i, 1);
      } else {
        delete adaptedOffer.name;
        delete adaptedOffer.value;
        delete adaptedOffer.checked;
      }
    }

    return adaptedWaypoint;
  }
}
