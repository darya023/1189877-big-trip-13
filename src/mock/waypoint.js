import dayjs from "dayjs";
import {TYPES} from "../const.js";
import {DESTINATIONS} from "../const.js";
import {getRandomInteger} from "../utils/utils.js";
import {generateOffers} from "./offers.js";
import {generateDestinationDescr, generatePhotos} from "./destination.js";
import {nanoid} from "nanoid";

const generateTypeName = () => {
  const randomIndex = getRandomInteger(0, TYPES.length - 1);

  return TYPES[randomIndex];
};

const generateTypeImgURL = (name) => {
  const url = `img/icons/${name.toLowerCase()}.png`;

  return url;
};

const generateDestination = () => {
  const randomIndex = getRandomInteger(0, DESTINATIONS.length - 1);

  return DESTINATIONS[randomIndex];
};

const generateDate = (start) => {
  const maxHoursRange = 24;
  const maxMinsRange = 60;
  let hoursRange = getRandomInteger(-maxHoursRange, maxHoursRange);
  let minsRange = getRandomInteger(-maxMinsRange, maxMinsRange);
  let date = dayjs().add(hoursRange, `hour`).add(minsRange, `minute`).toDate();

  if (start) {
    while (!(date >= start)) {
      hoursRange = getRandomInteger(-maxHoursRange, maxHoursRange);
      minsRange = getRandomInteger(-maxMinsRange, maxMinsRange);
      date = dayjs().add(hoursRange, `hour`).add(minsRange, `minute`).toDate();
    }
  }

  return date;
};

const generateId = () => {
  return nanoid();
};

export const generateWaypoint = () => {
  const typeName = generateTypeName();
  const startDate = generateDate();

  return {
    id: generateId(),
    type: {
      name: typeName,
      img: {
        url: generateTypeImgURL(typeName),
        alt: `Event type icon`,
      },
    },
    offers: generateOffers(),
    destination: {
      name: generateDestination(),
      description: generateDestinationDescr(),
      photos: generatePhotos(),
    },
    startDate,
    endDate: generateDate(startDate),
    price: getRandomInteger(5, 500),
    isFavorite: Boolean(getRandomInteger(0, 1)),
  };
};
