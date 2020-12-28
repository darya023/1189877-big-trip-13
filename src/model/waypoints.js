import Observer from "../utils/observer.js";

export default class Waypoints extends Observer {
  constructor() {
    super();
    this._waypoints = [];
  }

  getWaypoints() {
    return this._waypoints;
  }

  setWaypoints(waypoints) {
    this._waypoints = waypoints.slice();
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
}
