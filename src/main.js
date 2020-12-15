import TripInfoView from "./view/trip-info.js";
import SiteMenuView from "./view/site-menu.js";
import FilterView from "./view/filter.js";
import {generateWaypoint} from "./mock/waypoint.js";
import {generateFilterItems} from "./mock/filter-items.js";
import {generateSiteMenuItems} from "./mock/site-menu-items.js";
import {generateSortingItems} from "./mock/sorting.js";
import TripPresenter from "./presenter/trip.js";
import {render, RenderPosition} from "./utils/render.js";

const WAYPOINTS_COUNT = 20;
const waypoints = new Array(WAYPOINTS_COUNT).fill().map(generateWaypoint);
waypoints.sort((a, b) => a.startDate - b.startDate);

const filterItems = generateFilterItems(waypoints);
const menuItems = generateSiteMenuItems();
const sortingItems = generateSortingItems();
const message = `Click New Event to create your first point`;
const siteBodyElement = document.querySelector(`.page-body`);
const tripMainElement = siteBodyElement.querySelector(`.trip-main`);
const siteControlsElement = tripMainElement.querySelector(`.trip-controls`);

render(siteControlsElement, new SiteMenuView(menuItems), RenderPosition.AFTERBEGIN);
render(siteControlsElement, new FilterView(filterItems), RenderPosition.BEFOREEND);

if (waypoints.some(Boolean)) {
  render(tripMainElement, new TripInfoView(waypoints), RenderPosition.AFTERBEGIN);
}

const tripEventsElement = siteBodyElement.querySelector(`.trip-events`);
const tripPresenter = new TripPresenter(tripEventsElement, sortingItems, message);

tripPresenter.init(waypoints);
