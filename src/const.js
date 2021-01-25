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
  MAJOR: `MAJOR`, // обновить список и сбросить сортировку
  INIT: `INIT`, // инициализация приложения
  ERROR: `ERROR`, // ошибка приложения
};

export const FilterType = {
  EVERYTHING: `everything`,
  FUTURE: `future`,
  PAST: `past`
};

export const MenuItem = {
  TABLE: `table`,
  STATS: `stats`
};
