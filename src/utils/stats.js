export const makeItemsUniq = (items) => [...new Set(items)];

export const countWaypointsPriceByTypes = (waypoints, typeName) => {
  const waypointsByTypeName = waypoints.filter((waypoint) => waypoint.type.name.toUpperCase() === typeName.toUpperCase());

  return waypointsByTypeName.reduce((sum, current) => Number(sum) + Number(current.price), 0);
};

export const countWaypointsByTypes = (waypoints, typeName) => {
  return waypoints.filter((waypoint) => waypoint.type.name.toUpperCase() === typeName.toUpperCase()).length;
};

export const countWaypointsTimeByTypes = (waypoints, typeName) => {
  const waypointsByTypeName = waypoints.filter((waypoint) => waypoint.type.name.toUpperCase() === typeName.toUpperCase());
  const timeInMilliseconds = waypointsByTypeName.reduce((sum, current) => Number(sum) + Number(current.endDate) - Number(current.startDate), 0);
  const millisecondsPerDay = 86400000;

  return Math.trunc(timeInMilliseconds / millisecondsPerDay);
};
