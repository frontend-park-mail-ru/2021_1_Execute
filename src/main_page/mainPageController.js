import EventBus from '../utils/eventBus.js';
import './main.handlebars.js';

const context = {
  authorized: true,
  userDesks: [
    {
      id: 0,
      name: '0',
    },
    {
      id: 1,
      name: '1',
    },
    {
      id: 2,
      name: '2',
    },
    {
      id: 3,
      name: '3',
    },
  ],
  allDesks: [
    {
      id: 0,
      name: '0',
    },
    {
      id: 1,
      name: '1',
    },
    {
      id: 2,
      name: '2',
    },
    {
      id: 3,
      name: '3',
    },
    {
      id: 4,
      name: '4',
    },
  ],
};

export default class MainPageController {
  constructor(router, root) {
    this.root = root;
    this.EventBus = new EventBus();
  }

  start() {
    this.root.innerHTML = Handlebars.templates.main(context);
  }
}