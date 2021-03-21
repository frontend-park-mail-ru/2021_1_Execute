import EventBus from '../utils/eventBus.js';
import './main.handlebars.js';

export default class MainPageController {
  constructor(router, root) {
    this.root = root;
    this.EventBus = new EventBus();
  }

  start() {
    this.root.innerHTML = Handlebars.templates.main();
  }
}