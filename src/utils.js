import dayjs from "dayjs";

// Источник - https://github.com/you-dont-need/You-Dont-Need-Lodash-Underscore#_random
export const getRandomInteger = (a = 0, b = 1) => {
  const lower = Math.ceil(Math.min(a, b));
  const upper = Math.floor(Math.max(a, b));

  return Math.floor(lower + Math.random() * (upper - lower + 1));
};

export const humanizeDate = (date, format) => {
  return dayjs(date).format(format);
};

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
