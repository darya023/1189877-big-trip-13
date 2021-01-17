import WaypointView from "../view/waypoint.js";
import WaypointFormView from "../view/waypoint-form.js";
import {render, RenderPosition, replace, remove} from "../utils/render.js";
import {UpdateType, UserAction} from "../const.js";

const Mode = {
  DEFAULT: `DEFAULT`,
  EDITING: `EDITING`
};

export const State = {
  SAVING: `SAVING`,
  DELETING: `DELETING`
};

export default class Waypoint {
  constructor(tripContainer, changeData, changeMode) {
    this._tripContainer = tripContainer;
    this._changeData = changeData;
    this._changeMode = changeMode;

    this._waypointComponent = null;
    this._waypointFormComponent = null;
    this._mode = Mode.DEFAULT;

    this._handleWaypointRollupClick = this._handleWaypointRollupClick.bind(this);
    this._handleFormSubmit = this._handleFormSubmit.bind(this);
    this._handleFormRollupClick = this._handleFormRollupClick.bind(this);
    this._handleFormDeleteClick = this._handleFormDeleteClick.bind(this);
    this._handleFavoriteClick = this._handleFavoriteClick.bind(this);
    this._onEscKeyDown = this._onEscKeyDown.bind(this);
  }

  init(waypoint, offersModel, destinationsModel) {
    this._waypoint = waypoint;
    this._destinationsModel = destinationsModel;
    this._offersModel = offersModel;

    const prevWaypointComponent = this._waypointComponent;
    const prevWaypointFormComponent = this._waypointFormComponent;

    this._waypointComponent = new WaypointView(this._waypoint);
    this._waypointFormComponent = new WaypointFormView(this._offersModel, this._destinationsModel, false, this._waypoint);

    this._waypointComponent.setWaypointRollupClickHandler(this._handleWaypointRollupClick);
    this._waypointComponent.setFavoriteClickHandler(this._handleFavoriteClick);
    this._waypointFormComponent.setFormSubmitHandler(this._handleFormSubmit);
    this._waypointFormComponent.setFormRollupClickHandler(this._handleFormRollupClick);
    this._waypointFormComponent.setFormDeleteHandler(this._handleFormDeleteClick);

    if (prevWaypointComponent === null || prevWaypointFormComponent === null) {
      render(this._tripContainer.getElement(), this._waypointComponent, RenderPosition.BEFOREEND);
      return;
    }

    if (this._mode === Mode.DEFAULT) {
      replace(this._waypointComponent, prevWaypointComponent);
    }

    if (this._mode === Mode.EDITING) {
      replace(this._waypointComponent, prevWaypointFormComponent);
      this._mode = Mode.DEFAULT;
    }

    remove(prevWaypointComponent);
    remove(prevWaypointFormComponent);
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

  setViewState(state) {
    const resetFormState = () => {
      this._waypointFormComponent.updateData({
        isDisabled: false,
        isSaving: false,
        isDeleting: false
      });
    };

    switch (state) {
      case State.SAVING:
        this._waypointFormComponent.updateData({
          isDisabled: true,
          isSaving: true
        });
        break;
      case State.DELETING:
        this._waypointFormComponent.updateData({
          isDisabled: true,
          isDeleting: true
        });
        break;
      case State.ABORTING:
        this._waypointFormComponent.shake(resetFormState);
        break;
    }
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
      this._waypointFormComponent.reset(this._waypoint);
      this._replaceFormToWaypoint();
    }
  }

  _handleFavoriteClick() {
    this._changeData(
        UserAction.UPDATE,
        UpdateType.MINOR,
        Object.assign(
            {},
            this._waypoint,
            {
              isFavorite: !this._waypoint.isFavorite
            }
        )
    );
  }

  _handleFormSubmit(updatedWaypoint) {
    const isMinorUpdate = !(this._waypoint.startDate === updatedWaypoint.startDate
                            || this._waypoint.endDate === updatedWaypoint.endDate);

    this._changeData(
        UserAction.UPDATE,
        (isMinorUpdate) ? UpdateType.MINOR : UpdateType.PATCH,
        updatedWaypoint
    );
  }

  _handleFormDeleteClick(waypoint) {
    this._changeData(
        UserAction.DELETE,
        UpdateType.MINOR,
        waypoint
    );
  }

  _handleFormRollupClick() {
    this._waypointFormComponent.reset(this._waypoint);
    this._replaceFormToWaypoint();
  }

  _handleWaypointRollupClick() {
    this._replaceWaypointToForm();
  }
}
