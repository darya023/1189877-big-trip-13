import WaypointsModel from "./model/waypoints.js";
import OffersModel from "./model/offers.js";
import DestinationsModel from "./model/destinations.js";

const Method = {
  GET: `GET`,
  PUT: `PUT`
};

const SuccessHTTPStatusRange = {
  MIN: 200,
  MAX: 299
};

export default class Api {
  constructor(endPoint, authorization) {
    this._endPoint = endPoint;
    this._authorization = authorization;
  }

  getWaypoints() {
    return this._load({url: `points`})
        .then(Api.toJSON)
        .then((waypoints) => waypoints.map(WaypointsModel.adaptToClient));
  }

  getOffers() {
    return this._load({url: `offers`})
        .then(Api.toJSON)
        .then((offers) => offers.map(OffersModel.adaptToClient));
  }

  getDestinations() {
    return this._load({url: `destinations`})
        .then(Api.toJSON)
        .then((destinations) => destinations.map(DestinationsModel.adaptToClient));
  }

  updateWaypoint(waypoint) {
    return this._load({
      url: `points/${waypoint.id}`,
      method: Method.PUT,
      body: JSON.stringify(WaypointsModel.adaptToServer(waypoint)),
      headers: new Headers({"Content-Type": `application/json`})
    })
        .then(Api.toJSON)
        .then(WaypointsModel.adaptToClient);
  }

  _load({
    url,
    method = Method.GET,
    body = null,
    headers = new Headers()
  }) {
    headers.append(`Authorization`, this._authorization);

    return fetch(
        `${this._endPoint}/${url}`,
        {method, body, headers}
    )
        .then(Api.checkStatus)
        .catch(Api.catchError);
  }

  static checkStatus(response) {
    if (
      response.status < SuccessHTTPStatusRange.MIN ||
        response.status > SuccessHTTPStatusRange.MAX
    ) {
      throw new Error(`${response.status}: ${response.statusText}`);
    }

    return response;
  }

  static toJSON(response) {
    return response.json();
  }

  static catchError(err) {
    throw err;
  }
}
