import TripInfoView from "../view/trip-info.js";
import {render, RenderPosition, remove} from "../utils/render.js";

export default class TripInfo {
  constructor(tripInfoContainer) {
    this._tripInfoContainer = tripInfoContainer;
  }

  init(waypoints) {
    this._tripInfoComponent = new TripInfoView(waypoints);
    render(this._tripInfoContainer, this._tripInfoComponent, RenderPosition.AFTERBEGIN);
  }

  destroy() {
    remove(this._tripInfoComponent);
  }
}
