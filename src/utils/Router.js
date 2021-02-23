import EventBus from './EventBus.js';

export default class Router {
  constructor() {
    this.EventBus = new EventBus();
  }

  subscribe(path, handler) {
    this.EventBus.subscribe(path, handler);
  }

  unsubscribe(path) {
    this.EventBus.unsubscribe(path);
  }

  go(path, ...data) {
    this.addHistoryRecord(path);
    this.EventBus.call(path, ...data);
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
