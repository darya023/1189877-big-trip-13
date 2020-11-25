export const generateTrip = () => {
  return {
    type: {
      name: `Taxi`,
      img: {
        url: `some url`,
        alt: `Event type icon`,
      },
      offers: [
        {
          name: `Add luggage`,
          price: 30,
        },
      ]
    },
    destination: {
      name: `Amsterdam`,
      description: `Lorem ipsum dolor`,
      photos: [
        {
          url: `some url`,
          alt: `Event photo`,
        }
      ]
    },
    startDate: null,
    endDate: null,
    price: 300,
    isFavorite: true,
  };
};
