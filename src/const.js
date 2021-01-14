export const TYPES = [
  `Taxi`,
  `Bus`,
  `Train`,
  `Ship`,
  `Transport`,
  `Drive`,
  `Flight`,
  `Check-in`,
  `Sightseeing`,
  `Restaurant`
];

export const DESTINATIONS = [
  `Amsterdam`,
  `Chamonix`,
  `Geneva`
];

export const DESCRIPTION = `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras aliquet varius magna, non porta ligula feugiat eget. Fusce tristique felis at fermentum pharetra. Aliquam id orci ut lectus varius viverra. Nullam nunc ex, convallis sed finibus eget, sollicitudin eget ante. Phasellus eros mauris, condimentum sed nibh vitae, sodales efficitur ipsum. Sed blandit, eros vel aliquam faucibus, purus ex euismod diam, eu luctus nunc ante ut dui. Sed sed nisi sed augue convallis suscipit in sed felis. Aliquam erat volutpat. Nunc fermentum tortor ac porta dapibus. In rutrum ac purus sit amet tempus.`;

export const WAYPOINT_FORM_DEFAULT = {
  type: {
    name: TYPES[0],
    img: {
      url: `img/icons/${TYPES[0].toLowerCase()}.png`,
      alt: `Event type icon`,
    },
  },
  offers: [],
  destination: {
    name: ``,
    description: ``,
    photos: [],
  },
  startDate: ``,
  endDate: ``,
  price: ``
};

export const SortingType = {
  DAY: `day`,
  EVENT: `event`,
  TIME: `time`,
  PRICE: `price`,
  OFFER: `offer`
};

export const UserAction = {
  UPDATE: `UPDATE`,
  ADD: `ADD`,
  DELETE: `DELETE`
};

export const UpdateType = {
  PATCH: `PATCH`, // обновить часть списка (ТМ)
  MINOR: `MINOR`, // обновить весь список ТМ
  MAJOR: `MAJOR`, // щбновить список и сбросить сортировку
  INIT: `INIT`, // инициализация приложения
  ERROR: `ERROR`, // инициализация приложения
};

export const FilterType = {
  EVERYTHING: `everything`,
  FUTURE: `future`,
  PAST: `past`
};

export const ErrorMessage = {
  PRICE: `Price must be a decimal number`,
  DESTINATION: `Destination must be selected from the list`,
};
