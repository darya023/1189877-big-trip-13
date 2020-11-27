const createFilters = (filters) => {
  let result = [];

  for (let i = 0; i < filters.length; i++) {
    const elem = `<div class="trip-filters__filter">
      <input 
        id="filter-${filters[i].name}"
        class="trip-filters__filter-input
        visually-hidden"
        type="radio"
        name="trip-filter"
        value="${filters[i].name}"
        ${(i === 0) ? ` checked` : ``}
        ${filters[i].count ? `` : ` disabled`}
      >
      <label class="trip-filters__filter-label" for="filter-${filters[i].name}">
        ${filters[i].name}
      </label>
    </div>`;

    result.push(elem);
  }

  return result.join(``);
};

export const createTripFiltersTemplate = (filters) => {
  const createdFilters = createFilters(filters);

  console.log(filters);

  return `<h2 class="visually-hidden">Filter events</h2>
  <form class="trip-filters" action="#" method="get">
    ${createdFilters}
    <button class="visually-hidden" type="submit">Accept filter</button>
  </form>`;
};
