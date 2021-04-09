import EventBus from './eventBus.js';

/**
 * @param {string} path
 * @returns {string[]}
 */
const pathToArray = (path) => path.match(/[^/]{1,}/g) || [];

/**
 * @param {string[]} arr
 * @returns {string}
 */
const arrayToPath = (arr) => `/${arr.join('/')}`;

/**
 * @param {string} path
 * @returns {string}
 */
const standardizedPath = (path) => arrayToPath(pathToArray(path));

export default class Router {
  constructor() {
    this.routes = new EventBus();
  }

  /**
   * @param {string} path
   * @param {(pathArr: string[], ...data) => void} handler
   */
  addRoute(path, handler) {
    this.routes.subscribe(standardizedPath(path), handler);
  }

  /**
   * @param {string} path
   */
  deleteRoute(path) {
    this.routes.unsubscribe(path);
  }

  /**
   * @param {string} path
   * @param  {...any} data
   */
  go(path, ...data) {
    Router.addHistoryRecord(standardizedPath(path));
    this.goWithoutHistory(path, ...data);
  }

  /**
   * @param {string} path
   * @param  {...any} data
   */
  goWithoutHistory(path, ...data) {
    const newArray = pathToArray(path);
    for (let i = newArray.length; i >= 0; i -= 1) {
      const subUrl = arrayToPath(newArray.slice(0, i));
      if (this.routes.has(subUrl)) {
        this.routes.call(subUrl, newArray.slice(i), ...data);
        return;
      }
    }
    throw new Error('Missing path:', standardizedPath(path));
  }

  static addHistoryRecord(path, state = { urlPath: window.location.pathname }) {
    window.history.pushState(state, '', standardizedPath(path));
  }

  static back() {
    window.history.back();
  }

  static forward() {
    window.history.forward();
  }
}
