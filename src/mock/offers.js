import {getRandomInteger} from "../utils/utils.js";
import {TYPES} from "../const.js";

export const generateOffers = () => {
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

  let result = [];

  for (const type of TYPES) {
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

    result.push({
      typeName: type,
      offers: Array.from(offers)
    });
  }

  return result;
};
