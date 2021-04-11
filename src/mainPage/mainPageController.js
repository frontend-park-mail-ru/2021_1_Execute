import EventBus from '../utils/eventBus.js';
import MainPageModel from './mainPageModel.js';
import MainPageView from './mainPageView.js';
import { MainPageEvent } from './mainPageEvents.js';

export default class MainPageController {
  /**
   * @param router {!Router}
   * @param root {!HTMLElement}
   * @return {!MainPageController}
   */
  constructor(router, root) {
    this.root = root;
    this.eventBus = new EventBus();
    this.eventBus.subscribe(MainPageEvent.profile, () => router.go('/profile'));
    this.eventBus.subscribe(MainPageEvent.login, () => router.go('/login'));
    this.eventBus.subscribe(MainPageEvent.board, (id) => router.go(`/board/${id}`));
    this.model = new MainPageModel(this.eventBus);
    this.view = new MainPageView(this.eventBus, this.root);
  }

  start() {
    this.eventBus.call(MainPageEvent.getData);
  }
}
