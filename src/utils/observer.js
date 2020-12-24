export default class Observer {
  constructor() {
    this._observers = [];
  }

  addObserver(observer) {
    this._observers.push(observer);
  }

  removeObserver(removedObserver) {
    this._observers = this._observers.filter(
        (observer) => observer !== removedObserver
    );
  }

  _notify(event, payload) {
    this._observers.forEach((observer) => observer(event, payload));
  }
}
