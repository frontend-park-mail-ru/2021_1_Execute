import EventBus from './EventBus.js';

export default class Router extends EventBus {
  static addHistoryRecord(path, state = { urlPath: window.location.pathname }) {
    window.history.pushState(state, '', path);
  }

  static back() {
    window.history.back();
  }

  static forward() {
    window.history.forward();
  }

  go(path, ...data) {
    this.addHistoryRecord(path);
    this.call(path, data);
  }
}
