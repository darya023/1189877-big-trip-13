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
import {render, RenderPosition, replace} from "./utils/render.js";

const WAYPOINTS_COUNT = 20;
const waypoints = new Array(WAYPOINTS_COUNT).fill().map(generateWaypoint);
waypoints.sort((a, b) => a.startDate - b.startDate);

const filterItems = generateFilterItems(waypoints);
const menuItems = generateSiteMenuItems();
const sortingItems = generateSortingItems();

const renderWaypoint = (tripElement, waypoint) => {
  const waypointComponent = new WaypointView(waypoint);
  const waypointFormComponent = new WaypointFormView(waypoint);
  const onEscKeyDown = (event) => {
    if (event.key === `Esc` || event.key === `Escape`) {
      event.preventDefault();
      replace(waypointComponent, waypointFormComponent);
      document.removeEventListener(`click`, onClickWaypointBtn);
      document.removeEventListener(`keydown`, onEscKeyDown);
    }
  };
  const onClickWaypointBtn = (event) => {
    const currentWaypointRollupBtn = waypointComponent.getElement().querySelector(`.event__rollup-btn`);

    if (event.target !== currentWaypointRollupBtn && event.target.className === `event__rollup-btn`) {
      replace(waypointComponent, waypointFormComponent);
      document.removeEventListener(`click`, onClickWaypointBtn);
      document.removeEventListener(`keydown`, onEscKeyDown);
    }
  }

  waypointComponent.setWaypointClickHandler(() => {
    const tripDetails = waypointFormComponent.getElement().querySelector(`.event__details`);

    tripDetails.innerHTML = ``;
    render(tripDetails, new WaypointOffersView(waypoint.offers), RenderPosition.AFTERBEGIN);
    render(tripDetails, new WaypointDestinationView(waypoint.destination), RenderPosition.BEFOREEND);
    replace(waypointFormComponent, waypointComponent);
    document.addEventListener(`click`, onClickWaypointBtn);
    document.addEventListener(`keydown`, onEscKeyDown);
  });

  waypointFormComponent.setFormClickHandler(() => {
    replace(waypointComponent, waypointFormComponent);
    document.removeEventListener(`click`, onClickWaypointBtn);
    document.removeEventListener(`keydown`, onEscKeyDown);
  });

  waypointFormComponent.setFormSubmitHandler(() => {
    replace(waypointComponent, waypointFormComponent);
    document.removeEventListener(`click`, onClickWaypointBtn);
    document.removeEventListener(`keydown`, onEscKeyDown);
  });
  
  render(tripElement, waypointComponent, RenderPosition.BEFOREEND);
};

const siteBodyElement = document.querySelector(`.page-body`);
const tripMainElement = siteBodyElement.querySelector(`.trip-main`);
const siteControlsElement = tripMainElement.querySelector(`.trip-controls`);

render(siteControlsElement, new SiteMenuView(menuItems), RenderPosition.AFTERBEGIN);
render(siteControlsElement, new FilterView(filterItems), RenderPosition.BEFOREEND);

const tripEventsElement = siteBodyElement.querySelector(`.trip-events`);

if (!waypoints.some(Boolean)) {
  const msg = `Click New Event to create your first point`;
  
  render(tripEventsElement, new SiteMsgView(msg), RenderPosition.BEFOREEND);

  } else {

  render(tripMainElement, new TripInfoView(waypoints), RenderPosition.AFTERBEGIN);

  const tripComponent = new TripView();
  
  render(tripEventsElement, new SortingView(sortingItems), RenderPosition.BEFOREEND);
  render(tripEventsElement, tripComponent, RenderPosition.BEFOREEND);

  for (let i = 0; i < WAYPOINTS_COUNT; i++) {
    renderWaypoint(tripComponent.getElement(), waypoints[i]);
  }
}
