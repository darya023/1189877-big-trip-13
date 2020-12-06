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

