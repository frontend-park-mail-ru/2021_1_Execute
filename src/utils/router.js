/**
 * @typedef {string|RegExp} path
 * @typedef {(meta: string|RegExpExecArray, ...data) => void} handler
 */

/**
 * @param {path} path
 * @returns {path}
 */
const standardizedPath = (path) => (typeof path === 'string' ? `/${(path.match(/[^/]{1,}/g) || []).join('/')}` : path);

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
    const needPath = standardizedPath(path);
    if (typeof handler !== 'function') {
      throw new Error(`Handler must be a function, but found: ${handler}`);
    }
    const findElem = this.routes.find(([key]) => key === needPath);
    if (findElem) {
      findElem[1] = handler;
    } else {
      this.routes.push([needPath, handler]);
    }
  }

  /**
   * @param {path} path
   */
  deleteRoute(path) {
    const needPath = standardizedPath(path);
    this.routes = this.routes.filter(([key]) => key !== needPath);
  }

  /**
   * @param {string} path
   * @param  {...any} data
   */
  go(path, ...data) {
    const needPath = standardizedPath(path);
    Router.addHistoryRecord(needPath);
    this.goWithoutHistory(needPath, ...data);
  }

  /**
   * @param {string} path
   * @param  {...any} data
   */
  goWithoutHistory(path, ...data) {
    const needPath = standardizedPath(path);
    const findElem = this.routes.find(([key]) => (typeof key === 'string'
      ? key === needPath : key.exec(needPath)));
    if (!findElem) {
      throw new Error(`Missing path: ${standardizedPath(path)}`); // error-html-message?
    }
    const [key, value] = findElem;
    value(
      (typeof key === 'string' ? needPath : key.exec(needPath)),
      ...data,
    );
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
