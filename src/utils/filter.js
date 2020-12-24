import {isPast, isFuture} from "../utils/waypoint.js";
import {FilterType} from "../const.js";

export const filter = {
  [FilterType.EVERYTHING]: (waypoints) => waypoints,
  [FilterType.FUTURE]: (waypoints) => waypoints.filter((waypoint) => isFuture(waypoint.startDate, waypoint.endDate)),
  [FilterType.PAST]: (waypoints) => waypoints.filter((waypoint) => isPast(waypoint.startDate, waypoint.endDate)),
};
