import EventBus from '../utils/eventBus.js';
import './boardPage.handlebars.js';

export default class BoardPageController {
  constructor(router, root) {
    this.root = root;
    this.EventBus = new EventBus();
  }

  start() {
    // eslint-disable-next-line no-undef
    this.root.innerHTML = Handlebars.templates.boardPage();
  }
}
