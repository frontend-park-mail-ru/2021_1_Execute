import EventBus from '../utils/eventBus.js';
import './boardPage.handlebars.js';
import BoardPageModel from './boardPageModel.js';
import BoardPageView from './boardPageView.js';
import { BoardPageEvent } from './boardPageEvents.js';
import { ConstantEvents } from '../constants.js';

export default class BoardPageController {
  /**
   * @param router {!Router}
   * @param root {!HTMLElement}
   * @return {!BoardPageController}
   */
  constructor(router, root) {
    this.root = root;
    this.eventBus = new EventBus();
    this.eventBus.subscribe(BoardPageEvent.profile, () => router.go(ConstantEvents.profile));
    this.eventBus.subscribe(BoardPageEvent.login, () => router.go(ConstantEvents.login));
    this.model = new BoardPageModel(this.eventBus);
    this.view = new BoardPageView(this.eventBus, this.root);
  }

  /**
   * @param {number} boardId
   */
  start(boardId) {
    this.eventBus.call(BoardPageEvent.getData, boardId);
  }
}
