import EventBus from './EventBus.js';

export default class Router {
  constructor() {
    this.routes = new EventBus();
  }

  addRoute(path, handler) {
    this.routes.subscribe(path, handler);
  }

  deleteRoute(path) {
    this.routes.unsubscribe(path);
  }

  go(path, ...data) {
    this.addHistoryRecord(path);
    this.routes.call(path, ...data);
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
