import {getRandomInteger} from "../utils/utils.js";
import {DESCRIPTION, DESTINATIONS} from "../const.js";

const generateDestinationDescr = (destination) => {
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
    return destination + result.join(`. `).concat(`.`);
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

export const generateDestinations = () => {
  let destinations = [];

  for (const destination of DESTINATIONS) {
    const element = {
      name: destination,
      description: generateDestinationDescr(destination),
      photos: generatePhotos(),
    };
    destinations.push(element);
  }

  return destinations;
};
