import WaypointView from "../view/waypoint.js";
import WaypointFormView from "../view/waypoint-form.js";
import {render, RenderPosition, replace, remove} from "../utils/render.js";

const Mode = {
  DEFAULT: `DEFAULT`,
  EDITING: `EDITING`
};

export default class Waypoint {
  constructor(tripContainer, changeData, changeMode) {
    this._tripContainer = tripContainer;
    this._changeData = changeData;
    this._changeMode = changeMode;

    this._waypointComponent = null;
    this._waypointFormComponent = null;
    this._mode = Mode.DEFAULT;

    this._handleWaypointButtonClick = this._handleWaypointButtonClick.bind(this);
    this._handleFormSubmit = this._handleFormSubmit.bind(this);
    this._handleFormButtonClick = this._handleFormButtonClick.bind(this);
    this._handleFavoriteClick = this._handleFavoriteClick.bind(this);
    this._onEscKeyDown = this._onEscKeyDown.bind(this);
  }

  init(waypoint) {
    this._waypoint = waypoint;

    const prevWaypointComponent = this._waypointComponent;
    const prevWaypointFormComponent = this._waypointFormComponent;

    this._waypointComponent = new WaypointView(this._waypoint);
    this._waypointFormComponent = new WaypointFormView(this._waypoint);

    this._waypointComponent.setWaypointClickHandler(this._handleWaypointButtonClick);
    this._waypointComponent.setFavoriteClickHandler(this._handleFavoriteClick);
    this._waypointFormComponent.setFormSubmitHandler(this._handleFormSubmit);
    this._waypointFormComponent.setFormClickHandler(this._handleFormButtonClick);

    if (prevWaypointComponent === null || prevWaypointFormComponent === null) {
      render(this._tripContainer.getElement(), this._waypointComponent, RenderPosition.BEFOREEND);
      return;
    }

    if (this._mode === Mode.DEFAULT) {
      replace(this._waypointComponent, prevWaypointComponent);
    }

    remove(prevWaypointComponent);
  }

  resetViewMode() {

    if (this._mode !== Mode.DEFAULT) {
      this._replaceFormToWaypoint();
    }
  }

  destroy() {
    remove(this._waypointComponent);
    remove(this._waypointFormComponent);
  }

  _replaceFormToWaypoint() {
    replace(this._waypointComponent, this._waypointFormComponent);
    document.removeEventListener(`keydown`, this._onEscKeyDown);
    this._mode = Mode.DEFAULT;
  }

  _replaceWaypointToForm() {
    replace(this._waypointFormComponent, this._waypointComponent);
    document.addEventListener(`keydown`, this._onEscKeyDown);
    this._changeMode();
    this._mode = Mode.EDITING;
  }

  _onEscKeyDown(event) {
    if (event.key === `Esc` || event.key === `Escape`) {
      event.preventDefault();
      this._replaceFormToWaypoint();
    }
  }

  _handleFavoriteClick() {
    this._changeData(
        Object.assign(
            {},
            this._waypoint,
            {
              isFavorite: !this._waypoint.isFavorite
            }
        )
    );
  }

  _handleFormSubmit() {
    this._replaceFormToWaypoint();
  }

  _handleFormButtonClick() {
    this._replaceFormToWaypoint();
  }

  _handleWaypointButtonClick() {
    this._replaceWaypointToForm();
  }
}
