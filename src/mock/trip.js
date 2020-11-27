import dayjs from "dayjs";
import {TYPES} from "../const.js";
import {DESTINATIONS} from "../const.js";
import {DESCRIPTION} from "../const.js";
import {getRandomInteger} from "../utils.js";

const generateTypeName = () => {
  const randomIndex = getRandomInteger(0, TYPES.length - 1);

  return TYPES[randomIndex];
};

const generateTypeImgURL = (name) => {
  const url = `img/icons/${name.toLowerCase()}.png`;

  return url;
};

const generateOffers = () => {
  const allOffers = [
    {
      name: `Add luggage`,
      value: `luggage`
    },
    {
      name: `Switch to comfort`,
      value: `comfort`
    },
    {
      name: `Add meal`,
      value: `meal`
    },
    {
      name: `Choose seats`,
      value: `seats`
    },
    {
      name: `Travel by train`,
      value: `train`
    }
  ];

  for (const offer of allOffers) {
    offer.price = getRandomInteger(1, 200);
    offer.checked = Boolean(getRandomInteger(0, 1));
  }

  const randomLenght = getRandomInteger(0, 5);
  let offers = new Set();

  for (let i = 0; i < randomLenght; i++) {
    const randomIndex = getRandomInteger(0, allOffers.length - 1);

    offers.add(allOffers[randomIndex]);
  }

  return Array.from(offers);
};

const generateDestination = () => {
  const randomIndex = getRandomInteger(0, DESTINATIONS.length - 1);

  return DESTINATIONS[randomIndex];
};

const generateDestinationDescr = () => {
  const sentences = DESCRIPTION.split(`. `);
  const lastIndex = sentences.length - 1;
  const lastSentence = sentences[lastIndex];

  if (lastSentence.indexOf(`.`) !== `-1`) {
    sentences[lastIndex] = lastSentence.slice(0, lastSentence.indexOf(`.`));
  }

  const randomLenght = getRandomInteger(0, 5);
  let result = [];

  for (let i = 0; i < randomLenght; i++) {
    const randomIndex = getRandomInteger(0, lastIndex);

    result.push(sentences[randomIndex]);
  }

  if (result.some(Boolean)) {
    return result.join(`. `).concat(`.`);
  }

  return ``;
};

const generatePhotos = () => {
  const randomLength = getRandomInteger(1, 10);
  let photos = [];

  for (let i = 0; i < randomLength; i++) {
    const photo = {
      url: `http://picsum.photos/248/152?r=${Math.random()}`,
      alt: `Event photo`,
    };

    photos.push(photo);
  }
  return photos;
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

export const generateWaypoint = () => {
  const typeName = generateTypeName();
  const startDate = generateDate();

  return {
    type: {
      name: typeName,
      img: {
        url: generateTypeImgURL(typeName),
        alt: `Event type icon`,
      },
      offers: generateOffers()
    },
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
