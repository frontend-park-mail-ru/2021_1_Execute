import EventBus from '../utils/eventBus.js';
import MainPageModel from './mainPageModel.js';
import MainPageView from './mainPageView.js';
import { MainPageEvent } from './mainPageEvents.js';
import { ConstantEvents, getBoardRoute } from '../constants.js';

export default class MainPageController {
  /**
   * @param router {!Router}
   * @param root {!HTMLElement}
   * @return {!MainPageController}
   */
  constructor(router, root) {
    this.root = root;
    this.eventBus = new EventBus();
    this.eventBus.subscribe(MainPageEvent.profile, () => router.go(ConstantEvents.profile));
    this.eventBus.subscribe(MainPageEvent.login, () => router.go(ConstantEvents.login));
    this.eventBus.subscribe(MainPageEvent.board, (boardId) => router.go(getBoardRoute(boardId)));
    this.model = new MainPageModel(this.eventBus);
    this.view = new MainPageView(this.eventBus, this.root);
  }

  start() {
    this.eventBus.call(MainPageEvent.getData);
  }
}
