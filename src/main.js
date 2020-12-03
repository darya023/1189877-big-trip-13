import TripInfoView from "./view/trip-info.js";
import SiteMenuView from "./view/site-menu.js";
import FilterView from "./view/filter.js";
import SortingView from "./view/sorting.js";
import TripView from "./view/trip.js";
import WaypointView from "./view/waypoint.js";
import WaypointFormView from "./view/waypoint-form.js";
import SiteMsgView from "./view/site-msg.js";
import WaypointOffersView from "./view/waypoint-offers.js";
import WaypointDestinationView from "./view/waypoint-destination.js";
import {generateWaypoint} from "./mock/waypoint.js";
import {generateFilterItems} from "./mock/filter-items.js";
import {generateSiteMenuItems} from "./mock/site-menu-items.js";
import {generateSortingItems} from "./mock/sorting.js";
import {render, RenderPosition} from "./utils.js";

const WAYPOINTS_COUNT = 20;
const waypoints = new Array(WAYPOINTS_COUNT).fill().map(generateWaypoint);
waypoints.sort((a, b) => a.startDate - b.startDate);

const filterItems = generateFilterItems(waypoints);
const menuItems = generateSiteMenuItems();
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

  const onEscKeyDown = (event) => {
    if (event.key === `Esc` || event.key === `Escape`) {
      event.preventDefault();
      replaceWaypointFormToWaypoint();
      document.removeEventListener(`keydown`, onEscKeyDown);
    }
  };

  waypointComponentBtn.addEventListener(`click`, () => {
    replaceWaypointToWaypointForm();
    document.addEventListener(`keydown`, onEscKeyDown);
  });

  const waypointFormComponentBtn = waypointFormComponent.getElement().querySelector(`.event__rollup-btn`);

  waypointFormComponentBtn.addEventListener(`click`, () => {
    replaceWaypointFormToWaypoint();
    document.removeEventListener(`keydown`, onEscKeyDown);
  });

  const waypointForm = waypointFormComponent.getElement().querySelector(`form`);

  waypointForm.addEventListener(`submit`, (event) => {
    event.preventDefault();
    replaceWaypointFormToWaypoint();
    document.removeEventListener(`keydown`, onEscKeyDown);
  });

  render(tripElement, waypointComponent.getElement(), RenderPosition.BEFOREEND);
};

const siteBodyElement = document.querySelector(`.page-body`);
const tripMainElement = siteBodyElement.querySelector(`.trip-main`);


const siteControlsElement = tripMainElement.querySelector(`.trip-controls`);

render(siteControlsElement, new SiteMenuView(menuItems).getElement(), RenderPosition.AFTERBEGIN);
render(siteControlsElement, new FilterView(filterItems).getElement(), RenderPosition.BEFOREEND);

const tripEventsElement = siteBodyElement.querySelector(`.trip-events`);

if (!waypoints.some(Boolean)) {
  const msg = `Click New Event to create your first point`;
  
  render(tripEventsElement, new SiteMsgView(msg).getElement(), RenderPosition.BEFOREEND);

  } else {

  render(tripMainElement, new TripInfoView(waypoints).getElement(), RenderPosition.AFTERBEGIN);

  const tripComponent = new TripView();
  
  render(tripEventsElement, new SortingView(sortingItems).getElement(), RenderPosition.BEFOREEND);
  render(tripEventsElement, tripComponent.getElement(), RenderPosition.BEFOREEND);

  for (let i = 0; i < WAYPOINTS_COUNT; i++) {
    renderWaypoint(tripComponent.getElement(), waypoints[i]);
  }
}
