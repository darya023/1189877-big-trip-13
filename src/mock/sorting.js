import {SortingType} from "../const.js";

const generateSortingData = () => {
  const sortingItems = [
    {
      type: SortingType.DAY,
      name: `Day`,
      disabled: false,
    },
    {
      type: SortingType.EVENT,
      name: `Event`,
      disabled: true,
    },
    {
      type: SortingType.TIME,
      name: `Time`,
      disabled: false,
    },
    {
      type: SortingType.PRICE,
      name: `Price`,
      disabled: false,
    },
    {
      type: SortingType.OFFER,
      name: `Offers`,
      disabled: true,
    }
  ];

  return sortingItems;
};

export const generateSortingItems = () => {

  return generateSortingData();
};
