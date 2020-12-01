const generateSortingData = () => {
  const sortingItems = [
    {
      name: `Day`,
      disabled: false,
    },
    {
      name: `Event`,
      disabled: true,
    },
    {
      name: `Time`,
      disabled: false,
    },
    {
      name: `Price`,
      disabled: false,
    },
    {
      name: `Offers`,
      disabled: true,
    }
  ];

  for (const sortingItem of sortingItems) {
    if (sortingItem.name === `Offers`) {
      sortingItem.value = `offer`;
    } else {
      sortingItem.value = sortingItem.name.toLowerCase();
    }
  }

  return sortingItems;
};

export const generateSortingItems = () => {

  return generateSortingData();
};
