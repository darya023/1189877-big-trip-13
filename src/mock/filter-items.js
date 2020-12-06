import {isPast, isFuture} from "../utils/waypoint.js";

const filterMap = {
  everything: (waypoints) => waypoints.length,
  future: (waypoints) => waypoints.filter((waypoint) => isFuture(waypoint.startDate, waypoint.endDate)).length,
  past: (waypoints) => waypoints.filter((waypoint) => isPast(waypoint.startDate, waypoint.endDate)).length,
};

export const generateFilterItems = (waypoints) => {
  return Object.entries(filterMap).map(([name, countWaypoints]) => {
    return {
      name,
      count: countWaypoints(waypoints),
    };
  });
};
