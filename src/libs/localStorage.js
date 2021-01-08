export default class Storage {
  /**
   * @param {Storage} getStorage
   */
  constructor(getStorage = () => window.localStorage) {
    this.storage = getStorage();
  }

  /**
   * @param {String} key
   * @returns {String|null}
   */
  get(key) {
    return this.storage.getItem(key);
  }

  /**
   * @param {String} key
   * @param {String} value
   * @returns {void}
   */
  set(key, value) {
    this.storage.setItem(key, value);
  }

  /**
   * @param {String} key
   * @returns {void}
   */
  clearItem(key) {
    this.storage.removeItem(key);
  }

  /**
   * @param {String[]} keys
   * @returns {void}
   */
  clearItems(keys) {
    keys.forEach((key) => this.clearItem(key));
  }
}
