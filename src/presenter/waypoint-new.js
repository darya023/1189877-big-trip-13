import WaypointFormView from "../view/waypoint-form.js";
import {render, RenderPosition, remove} from "../utils/render.js";
import {UpdateType, UserAction} from "../const.js";

export default class WaypointNew {
  constructor(tripContainer, changeData, updateAddButton) {
    this._tripContainer = tripContainer;
    this._changeData = changeData;
    this._updateAddButton = updateAddButton;

    this._waypointFormComponent = null;

    this._handleFormSubmit = this._handleFormSubmit.bind(this);
    this._handleFormDeleteClick = this._handleFormDeleteClick.bind(this);
    this._onEscKeyDown = this._onEscKeyDown.bind(this);
  }

  init(offersModel, destinationsModel) {
    this._destinationsModel = destinationsModel;
    this._offersModel = offersModel;

    if (this._waypointFormComponent === null) {
      this._waypointFormComponent = new WaypointFormView(this._offersModel, this._destinationsModel, true);

      this._waypointFormComponent.setFormSubmitHandler(this._handleFormSubmit);
      this._waypointFormComponent.setFormDeleteHandler(this._handleFormDeleteClick);

      render(this._tripContainer.getElement(), this._waypointFormComponent, RenderPosition.AFTERBEGIN);
      document.addEventListener(`keydown`, this._onEscKeyDown);
    }
  }

  destroy() {
    if (this._waypointFormComponent !== null) {
      remove(this._waypointFormComponent);
      this._waypointFormComponent = null;
      document.removeEventListener(`keydown`, this._onEscKeyDown);
      this._updateAddButton(true);
    }
  }

  setSaving() {
    this._waypointFormComponent.updateData({
      isDisabled: true,
      isSaving: true
    });
  }

  setAborting() {
    const resetFormState = () => {
      this._waypointFormComponent.updateData({
        isDisabled: false,
        isSaving: false,
        isDeleting: false
      });
    };

    this._waypointFormComponent.shake(resetFormState);
  }

  _onEscKeyDown(event) {
    if (event.key === `Esc` || event.key === `Escape`) {
      event.preventDefault();
      this.destroy();
    }
  }

  _handleFormSubmit(waypoint) {
    waypoint.isFavorite = false;
    this._changeData(
        UserAction.ADD,
        UpdateType.MINOR,
        waypoint
    );
  }

  _handleFormDeleteClick() {
    this.destroy();
  }
}
