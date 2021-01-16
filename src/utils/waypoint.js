export const isPast = (startDate, endDate) => {
  const now = new Date();

  if (endDate <= now || (startDate <= now && endDate >= now)) {
    return true;
  }
  return false;
};

export const isFuture = (startDate, endDate) => {
  const now = new Date();

  if (startDate >= now || (startDate <= now && endDate >= now)) {
    return true;
  }
  return false;
};

export const getDurationTime = (waypoint) => {
  return waypoint.endDate - waypoint.startDate;
};

export const sortByDate = (waypoints) => {
  return waypoints.sort((a, b) => a.startDate - b.startDate);
};

export const sortByPrice = (waypoints) => {
  return waypoints.sort((a, b) => b.price - a.price);
};

export const sortByTime = (waypoints) => {
  return waypoints.sort((a, b) => getDurationTime(b) - getDurationTime(a));
};
