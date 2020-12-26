import AddButtonView from "../view/add-button.js";
import {render, RenderPosition, remove} from "../utils/render.js";

export default class AddButton {
  constructor(tripPresenter, addButtonContainer) {
    this._tripPresenter = tripPresenter;
    this._addButtonContainer = addButtonContainer;

    this._handleAddButtonClick = this._handleAddButtonClick.bind(this);
  }

  init(isNotDisabled) {
    this._addButtonComponent = new AddButtonView(isNotDisabled);
    this._addButtonComponent.setClickHandler(this._handleAddButtonClick);
    render(this._addButtonContainer, this._addButtonComponent, RenderPosition.BEFOREEND);
  }

  destroy() {
    remove(this._addButtonComponent);
  }

  _handleAddButtonClick() {
    this._tripPresenter.createWaypoint();
    remove(this._addButtonComponent);
    this.init(false);
  }
}
