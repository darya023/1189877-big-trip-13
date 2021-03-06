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

export const update = (items, updatedItem, index) => {
  if (!index) {
    index = items.findIndex((item) => item.id === updatedItem.id);

    if (index === -1) {
      return items;
    }
  }

  return [
    ...items.slice(0, index),
    updatedItem,
    ...items.slice(index + 1)
  ];
};

export const isOnline = () => {
  return window.navigator.onLine;
};
