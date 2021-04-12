/**
 * @typedef {string|RegExp} path
 * @typedef {(meta: string|RegExpExecArray, ...data) => void} handler
 */

export default class Router {
  constructor() {
    /**
     * @type {[path, handler][]}
     */
    this.routes = [];
  }

  /**
   * @param {path} path
   * @param {handler} handler
   * @throws ошибка, если переданный обработчик события - не функция
   */
  addRoute(path, handler) {
    if (typeof handler !== 'function') {
      throw new Error(`Handler must be a function, but found: ${handler}`);
    }
    const findElem = this.routes.find(([key]) => key === path);
    if (findElem) {
      findElem[1] = handler;
    } else {
      this.routes.push([path, handler]);
    }
  }

  /**
   * @param {path} path
   */
  deleteRoute(path) {
    this.routes = this.routes.filter(([key]) => key !== path);
  }

  /**
   * @param {string} path
   * @param  {...any} data
   */
  go(path, ...data) {
    Router.addHistoryRecord(path);
    this.goWithoutHistory(path, ...data);
  }

  /**
   * @param {string} path
   * @param  {...any} data
   */
  goWithoutHistory(path, ...data) {
    const findElem = this.routes.find(([key]) => (typeof key === 'string'
      ? key === path : key.exec(path)));
    if (!findElem) {
      throw new Error(`Missing path: ${path}`); // error-html-message?
    }
    const [key, value] = findElem;
    value(
      (typeof key === 'string' ? path : key.exec(path)),
      ...data,
    );
  }

  static addHistoryRecord(path, state = { urlPath: window.location.pathname }) {
    window.history.pushState(state, '', path);
  }

  static back() {
    window.history.back();
  }

  static forward() {
    window.history.forward();
  }
}
