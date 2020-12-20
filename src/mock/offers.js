import {getRandomInteger} from "../utils/utils.js";

export const generateOffers = (isNewTypeChecked) => {
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
    if (!isNewTypeChecked) {
      offer.checked = Boolean(getRandomInteger(0, 1));
    } else {
      offer.checked = false;
    }
  }

  const randomLenght = getRandomInteger(0, 5);
  let offers = new Set();

  for (let i = 0; i < randomLenght; i++) {
    const randomIndex = getRandomInteger(0, allOffers.length - 1);

    offers.add(allOffers[randomIndex]);
  }

  return Array.from(offers);
};
