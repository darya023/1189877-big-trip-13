import WaypointsModel from "../model/waypoints.js";
import OffersModel from "../model/offers.js";
import {isOnline} from "../utils/utils.js";

const StoreKey = {
  WAYPOINTS: `waypoints`,
  OFFERS: `offers`,
};

const getSyncedWaypoints = (items) => {
  return items.filter(({success}) => success)
    .map(({payload}) => payload.point);
};

const createStoreStructure = (items) => {
  return items.reduce((acc, current) => {
    return Object.assign({}, acc, {
      [current.id]: current,
    });
  }, {});
};

export default class Provider {
  constructor(api, store) {
    this._api = api;
    this._store = store;
  }

  getWaypoints() {
    if (isOnline()) {
      return this._api.getWaypoints()
        .then((waypoints) => {
          const items = createStoreStructure(waypoints.map(WaypointsModel.adaptToServer));
          this._store.setItems(StoreKey.WAYPOINTS, items);

          return waypoints;
        });
    }

    const storeWaypoints = Object.values(this._store.getItems(StoreKey.WAYPOINTS));

    return Promise.resolve(storeWaypoints.map(WaypointsModel.adaptToClient));
  }

  getOffers() {
    if (isOnline()) {
      return this._api.getOffers()
        .then((offers) => {
          const items = offers.map(OffersModel.adaptToServer);
          this._store.setItems(StoreKey.OFFERS, items);

          return offers;
        });
    }

    const storeOffers = Object.values(this._store.getItems(StoreKey.OFFERS));

    return Promise.resolve(storeOffers.map(OffersModel.adaptToClient));
  }

  getDestinations() {
    if (isOnline()) {
      return this._api.getDestinations();
    }

    return Promise.resolve([]);
  }

  updateWaypoint(waypoint) {
    if (isOnline()) {
      return this._api.updateWaypoint(waypoint)
        .then((updatedWaypoint) => {
          this._store.setItem(StoreKey.WAYPOINTS, WaypointsModel.adaptToServer(updatedWaypoint), updatedWaypoint.id);
          return updatedWaypoint;
        });
    }

    this._store.setItem(StoreKey.WAYPOINTS, WaypointsModel.adaptToServer(Object.assign({}, waypoint)), waypoint.id);

    return Promise.resolve(waypoint);
  }

  addWaypoint(waypoint) {
    if (isOnline()) {
      return this._api.addWaypoint(waypoint)
        .then((newWaypoint) => {
          this._store.setItem(newWaypoint.id, WaypointsModel.adaptToServer(newWaypoint));
          return newWaypoint;
        });
    }

    return Promise.resolve(waypoint);
  }

  deleteWaypoint(waypoint) {
    if (isOnline()) {
      return this._api.deleteWaypoint(waypoint)
        .then(() => this._store.removeItem(waypoint.id));
    }

    return Promise.resolve(waypoint);
  }

  sync() {
    if (isOnline()) {
      const storeWaypoints = Object.values(this._store.getItems(StoreKey.WAYPOINTS));

      return this._api.sync(storeWaypoints)
        .then((response) => {
          const updatedWaypoints = getSyncedWaypoints(response.updated);
          const items = createStoreStructure([...updatedWaypoints]);

          this._store.setItems(StoreKey.WAYPOINTS, items);
        });
    }

    return Promise.reject(new Error(`Sync data failed`));
  }
}
