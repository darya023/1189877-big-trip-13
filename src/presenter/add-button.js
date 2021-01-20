import AddButtonView from "../view/add-button.js";
import {render, RenderPosition, remove} from "../utils/render.js";

export default class AddButton {
  constructor(tripPresenter, addButtonContainer, handleAddButtonClick) {
    this._tripPresenter = tripPresenter;
    this._addButtonContainer = addButtonContainer;

    this._handleAddButtonClick = handleAddButtonClick;
  }

  init(isNotDisabled) {
    this._addButtonComponent = new AddButtonView(isNotDisabled);
    this._addButtonComponent.setClickHandler(this._handleAddButtonClick);
    render(this._addButtonContainer, this._addButtonComponent, RenderPosition.BEFOREEND);
  }

  destroy() {
    remove(this._addButtonComponent);
  }
}
