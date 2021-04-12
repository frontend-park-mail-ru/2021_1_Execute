/**
 * @typedef {RegExp} path
 * @typedef {(meta: string|RegExpExecArray, ...data) => void} handler
 */

/**
 * @param {RegExp} r1
 * @param {RegExp} r2
 * @returns {boolean}
 */
function pathSame(r1, r2) {
  return r1 instanceof RegExp
    && r2 instanceof RegExp
    && r1.source === r2.source
    && r1.flags.split('').sort().join('') === r2.flags.split('').sort().join('');
}

export default class Router {
  constructor() {
    /**
     * @type {{path:path,handler:handler}[]}
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
    const findElem = this.routes.find(({ path: key }) => pathSame(key, path));
    if (findElem) {
      findElem.handler = handler;
    } else {
      this.routes.push({ path, handler });
    }
  }

  /**
   * @param {path} path
   */
  deleteRoute(path) {
    this.routes = this.routes.filter(({ path: key }) => !pathSame(key, path));
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
    const findElem = this.routes.find(({ path: key }) => key.exec(path));
    if (!findElem) {
      throw new Error(`Missing path: ${path}`); // error-html-message?
    }
    const { path: key, handler } = findElem;
    handler(key.exec(path), ...data);
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
