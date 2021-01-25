export default class Store {
  constructor(key, storage) {
    this._storage = storage;
    this._storeKey = key;
  }

  getItems(key) {
    try {
      const store = JSON.parse(this._storage.getItem(this._storeKey));

      return (key) ? store[key] : store || {};
    } catch (error) {
      return {};
    }
  }

  setItems(key, items) {
    const storedItems = {[key]: items};
    const store = this.getItems();

    this._storage.setItem(
        this._storeKey,
        JSON.stringify(
            Object.assign({}, store, storedItems)
        )
    );
  }

  setItem(key, value, id) {
    const storedItem = {[id]: value};
    const store = this.getItems();
    const newItem = Object.assign({}, store[key], storedItem);

    this._storage.setItem(
        this._storeKey,
        JSON.stringify(
            Object.assign(
                {},
                store,
                {
                  [key]: newItem
                }
            )
        )
    );
  }

  removeItem(key) {
    const store = this.getItems();

    delete store[key];

    this._storage.setItem(
        this._storeKey,
        JSON.stringify(store)
    );
  }
}
