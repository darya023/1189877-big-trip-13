import WaypointView from "../view/waypoint.js";
import WaypointFormView from "../view/waypoint-form.js";
import {render, RenderPosition, replace, remove} from "../utils/render.js";
import {isOnline} from "../utils/utils.js";
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
  constructor(tripContainer, changeData, changeMode, renderToast, removeToast) {
    this._tripContainer = tripContainer;
    this._changeData = changeData;
    this._changeMode = changeMode;
    this._renderToast = renderToast;
    this._removeToast = removeToast;

    this._waypointComponent = null;
    this._waypointFormComponent = null;
    this._isWaypointFormComponentActive = false;
    this._mode = Mode.DEFAULT;

    this._handleWaypointRollupClick = this._handleWaypointRollupClick.bind(this);
    this._handleFormSubmit = this._handleFormSubmit.bind(this);
    this._handleFormRollupClick = this._handleFormRollupClick.bind(this);
    this._handleFormDeleteClick = this._handleFormDeleteClick.bind(this);
    this._handleFavoriteClick = this._handleFavoriteClick.bind(this);
    this._escKeyDownHandler = this._escKeyDownHandler.bind(this);
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
      if (this._isWaypointFormComponentActive) {
        this._waypointFormComponent.updateData({
          isDisabled: false,
          isSaving: false,
          isDeleting: false
        });
      }
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
    this._removeToast();
    replace(this._waypointComponent, this._waypointFormComponent);
    this._isWaypointFormComponentActive = false;
    document.removeEventListener(`keydown`, this._escKeyDownHandler);
    this._mode = Mode.DEFAULT;
  }

  _replaceWaypointToForm() {
    replace(this._waypointFormComponent, this._waypointComponent);
    this._isWaypointFormComponentActive = true;
    document.addEventListener(`keydown`, this._escKeyDownHandler);
    this._changeMode();
    this._mode = Mode.EDITING;
  }

  _escKeyDownHandler(event) {
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
        ),
        true
    );
  }

  _handleFormSubmit(updatedWaypoint) {
    if (!isOnline()) {
      const message = `You can't save waypoint offline`;

      this.setViewState(State.ABORTING);
      this._renderToast(this._waypointFormComponent, message);

      return;
    }

    const isMinorUpdate = !(this._waypoint.startDate === updatedWaypoint.startDate
                            || this._waypoint.endDate === updatedWaypoint.endDate);

    if (this._destinationsModel.getDestination(updatedWaypoint.destination.name) === undefined) {
      const message = `Destination field has invalid value. Please choose one from the list`;

      this.setViewState(State.ABORTING);
      this._renderToast(this._waypointFormComponent, message);

      return;
    }

    if (updatedWaypoint.startDate === ``) {
      const message = `Start date is invalid`;

      this.setViewState(State.ABORTING);
      this._renderToast(this._waypointFormComponent, message);

      return;
    }

    if (updatedWaypoint.endDate === ``) {
      const message = `End date is invalid`;

      this.setViewState(State.ABORTING);
      this._renderToast(this._waypointFormComponent, message);

      return;
    }

    if (updatedWaypoint.price === ``) {
      const message = `Price is invalid`;

      this.setViewState(State.ABORTING);
      this._renderToast(this._waypointFormComponent, message);

      return;
    }

    this._changeData(
        UserAction.UPDATE,
        (isMinorUpdate) ? UpdateType.MINOR : UpdateType.PATCH,
        updatedWaypoint
    );
  }

  _handleFormDeleteClick(waypoint) {
    if (!isOnline()) {
      const message = `You can't delete waypoint offline`;

      this.setViewState(State.ABORTING);
      this._renderToast(this._waypointFormComponent, message);

      return;
    }

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
    if (!isOnline()) {
      const message = `You can't edit waypoint offline`;

      this._renderToast(this._waypointComponent, message);

      return;
    }

    this._replaceWaypointToForm();
  }
}
