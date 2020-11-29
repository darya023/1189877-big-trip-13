const createDescription = (description) => {
  if (description) {
    return `<p class="event__destination-description">${description}</p>`;
  }

  return ``;
};

const createPhotos = (photos) => {
  if (photos.some(Boolean)) {
    const photo = createPhoto(photos);

    return `<div class="event__photos-container">
      <div class="event__photos-tape">
        ${photo}
      </div>
    </div>`;
  }

  return ``;
};

const createPhoto = (photos) => {
  let result = [];

  for (const photo of photos) {
    const elem = `<img class="event__photo" src="${photo.url}" alt="${photo.alt}">`;

    result.push(elem);
  }

  return result.join(``);
};

export const createWaypointDestinationTemplate = (waypoint = {}) => {
  const {
    destination = {
      description: ``,
      photos: ``
    },
  } = waypoint;
  const description = createDescription(destination.description);
  const photos = createPhotos(destination.photos);

  if (destination.description || destination.photos.some(Boolean)) {
    return `<section class="event__section  event__section--destination">
      <h3 class="event__section-title  event__section-title--destination">Destination</h3>
      ${description}
      ${photos}
    </section>`;
  }

  return ``;
};
