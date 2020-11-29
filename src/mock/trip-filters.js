import {isPast, isFuture} from "../utils.js";

const filterMap = {
  everything: (waypoints) => waypoints.length,
  future: (waypoints) => waypoints.filter((waypoint) => isFuture(waypoint.startDate, waypoint.endDate)).length,
  past: (waypoints) => waypoints.filter((waypoint) => isPast(waypoint.startDate, waypoint.endDate)).length,
};

export const generateFilters = (waypoints) => {
  return Object.entries(filterMap).map(([name, countWaypoints]) => {
    return {
      name,
      count: countWaypoints(waypoints),
    };
  });
};
