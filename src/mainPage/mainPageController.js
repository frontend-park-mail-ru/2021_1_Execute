import EventBus from '../utils/eventBus.js';
import './mainPage.handlebars.js';

const context = {
  authorized: true,
  userDesks: [
    {
      id: 5,
      name: 'dedeed',
      description: 'hdhhdhdhwjhwd',
    },
    {
      id: 6,
      name: 'deldelk',
      description: 'dliekkldele',
    },
    {
      id: 7,
      name: 'cdmc,mc,',
      description: 'dkleldkelde',
    },
    {
      id: 8,
      name: 'dedemed',
      description: 'dejhjdehjedhe',
    },
  ],
  allDesks: [
    {
      id: 0,
      name: '0',
      description: 'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa',
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
    this.root.innerHTML = Handlebars.templates.mainPage(context);
  }
}