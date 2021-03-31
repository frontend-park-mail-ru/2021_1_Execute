import EventBus from '../utils/eventBus.js';
import './boardPage.handlebars.js';
// import BoardPageModel from './boardPageModel.js';
import BoardPageView from './boardPageView.js';
import { BoardPageEvent } from './boardPageEvents.js';

const board = {
  isStared: true,
  name: 'asdasdasnamename',
  description: 'opisanielolopposumlorem',
  users: {
    owner: {
      id: 1,
      avatar: '../../img/32.jpg',
    },
    admins: [],
    members: [],
  },
  rows: [
    {
      id: 0,
      position: 0,
      name: 'row1',
      tasks: [
        {
          name: 'task1',
          id: 2,
          position: 0,
        },
      ],
    },
  ],
};
const user = {
  username: 'me',
  email: 'sadsda@asda',
  avatar: 'sadsd',
};

export default class BoardPageController {
  /**
   * @param router {!Router}
   * @param root {!HTMLElement}
   * @return {!BoardPageController}
   */
  constructor(router, root) {
    this.root = root;
    this.eventBus = new EventBus();
    this.eventBus.subscribe(BoardPageEvent.profile, () => router.go('/profile'));
    this.eventBus.subscribe(BoardPageEvent.login, () => router.go('/login'));
    //    this.model = new BoardPageModel(this.eventBus);
    this.view = new BoardPageView(this.eventBus, this.root);
  }

  start() {
    this.eventBus.call(BoardPageEvent.renderData, user, board);
  }
}
