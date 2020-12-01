import TripInfoView from "./view/trip-info.js";
import SiteMenuView from "./view/site-menu.js";
import FilterView from "./view/trip-filters.js";
import SortingView from "./view/trip-sorting.js";
import TripView from "./view/trip-list.js";
import WaypointView from "./view/trip.js";
import WaypointFormView from "./view/trip-form.js";
import SiteMsgView from "./view/trip-msg.js";
import WaypointOffersView from "./view/trip-offers.js";
import WaypointDestinationView from "./view/trip-destination.js";
import {generateWaypoint} from "./mock/trip.js";
import {generateFilters} from "./mock/trip-filters.js";
import {generateMenuItems} from "./mock/site-menu.js";
import {generateSortingItems} from "./mock/trip-sorting.js";
import {render, RenderPosition} from "./utils.js";

const WAYPOINTS_COUNT = 20;
const waypoints = new Array(WAYPOINTS_COUNT).fill().map(generateWaypoint);
waypoints.sort((a, b) => a.startDate - b.startDate);

const filters = generateFilters(waypoints);
const menuItems = generateMenuItems();
const sortingItems = generateSortingItems();

const renderWaypoint = (tripElement, waypoint) => {
  const waypointComponent = new WaypointView(waypoint);
  const waypointFormComponent = new WaypointFormView(waypoint);

  const replaceWaypointToWaypointForm = () => {
    tripElement.replaceChild(waypointFormComponent.getElement(), waypointComponent.getElement());

    const tripDetails = waypointFormComponent.getElement().querySelector(`.event__details`);

    tripDetails.innerHTML = ``;

    render(tripDetails, new WaypointOffersView(waypoint.offers).getElement(), RenderPosition.AFTERBEGIN);
    render(tripDetails, new WaypointDestinationView(waypoint.destination).getElement(), RenderPosition.BEFOREEND);
  };

  const replaceWaypointFormToWaypoint = () => {
    tripElement.replaceChild(waypointComponent.getElement(), waypointFormComponent.getElement());
  };

  const waypointComponentBtn = waypointComponent.getElement().querySelector(`.event__rollup-btn`);

  waypointComponentBtn.addEventListener(`click`, () => {
    replaceWaypointToWaypointForm();
  });

  const waypointForm = waypointFormComponent.getElement().querySelector(`form`);

  waypointForm.addEventListener(`submit`, (event) => {
    event.preventDefault();
    replaceWaypointFormToWaypoint();
  });

  render(tripElement, waypointComponent.getElement(), RenderPosition.BEFOREEND);
};

const siteBodyElement = document.querySelector(`.page-body`);
const tripMainElement = siteBodyElement.querySelector(`.trip-main`);

render(tripMainElement, new TripInfoView(waypoints).getElement(), RenderPosition.AFTERBEGIN);

const siteControlsElement = tripMainElement.querySelector(`.trip-controls`);

render(siteControlsElement, new SiteMenuView(menuItems).getElement(), RenderPosition.AFTERBEGIN);
render(siteControlsElement, new FilterView(filters).getElement(), RenderPosition.BEFOREEND);

const tripEventsElement = siteBodyElement.querySelector(`.trip-events`);
const tripComponent = new TripView();

render(tripEventsElement, new SortingView(sortingItems).getElement(), RenderPosition.BEFOREEND);
render(tripEventsElement, tripComponent.getElement(), RenderPosition.BEFOREEND);

if (!waypoints.some(Boolean)) {
  const msg = `Click New Event to create your first point`;

  render(tripEventsElement, new SiteMsgView(msg).getElement(), RenderPosition.BEFOREEND);
}

for (let i = 0; i < WAYPOINTS_COUNT; i++) {
  renderWaypoint(tripComponent.getElement(), waypoints[i]);
}

