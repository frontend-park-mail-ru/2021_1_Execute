import './mainPage.handlebars.js';
import EventBus from '../utils/eventBus.js';

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
      image: '/32.jpg',
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
      description: 'Если ты видишь этот текст до конца, то это больша проблема, так как я не нашел нормального решения (не через какие-то древние костыли) как сделать обрезания многострочного текста',
    },
    {
      id: 1,
      image: '/35.jpg',
      name: '1',
    },
    {
      id: 2,
    },
    {
      id: 3,
      name: '3',
      image: '/white.png',
      description: 'Тест тупо белого фона',
    },
  ],
};

export default class MainPageController {
  constructor(router, root) {
    this.root = root;
    this.EventBus = new EventBus();
  }

  start() {
    // eslint-disable-next-line no-undef
    this.root.innerHTML = Handlebars.templates.mainPage(context);
  }
}
