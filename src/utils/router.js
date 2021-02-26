import EventBus from './eventBus.js';

const standardizedPath = (path) => {
  let newPath = path;
  if (!path.startsWith('/')) {
    newPath = `/${newPath}`;
  }
  if (!path.endsWith('/')) {
    newPath += '/';
  }
  return newPath;
};

export default class Router {
  constructor() {
    this.routes = new EventBus();
  }

  addRoute(path, handler) {
    this.routes.subscribe(standardizedPath(path), handler);
  }

  deleteRoute(path) {
    this.routes.unsubscribe(path);
  }

  go(path, ...data) {
    const newPath = standardizedPath(path);
    Router.addHistoryRecord(newPath);
    this.routes.call(newPath, ...data);
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
