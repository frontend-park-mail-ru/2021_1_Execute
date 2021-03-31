import './mainPage.handlebars.js';
import '../header/header.handlebars.js';
import { makeChecker } from '../utils/temporaryReplacement.js';
import { MainPageEvent } from './mainPageEvents.js';

export default class MainPageView {
  /**
   * @param {!EventBus}
   * @return {!ProfileView}
   */
  constructor(eventBus, root) {
    this.root = root;
    this.eventBus = eventBus;
    this.eventBus.subscribe(MainPageEvent.renderData,
      (user, boards) => this.renderData(user, boards));
    this.eventBus.subscribe(MainPageEvent.renderNewBoard,
      (board) => this.renderNewBoard(board));
  }

  /**
 * @typedef {Object} board
 * @property {!number} id
 * @property {!('Guest'|'Member'|'Admin'|'Owner')} access
 * @property {boolean} isStared
 * @property {string} name
 * @property {string} description
 */

  /**
 * @typedef {Object} user
 * @property {string} username
 * @property {string} email
 * @property {string} avatar
 */

  /**
   * @param {user} user
   * @param {board[]} boards
   */
  renderData(user, boards) {
    // eslint-disable-next-line no-undef
    this.root.innerHTML = Handlebars.templates.header(user);

    const accessBoards = boards.reduce((accum, board) => {
      accum[board.access].push(board);
      return accum;
    }, {
      Guest: [], Member: [], Admin: [], Owner: [],
    });

    // eslint-disable-next-line no-undef
    this.root.innerHTML += Handlebars.templates.mainPage(accessBoards);

    this.findNeedElem(boards);
    this.addEventListeners(boards);
  }

  /**
   * @param {board[]} boards
   */
  findNeedElem(boards) {
    this.photoAvatar = document.getElementById('avatar-photo');
    this.buttonAddDesk = document.getElementById('adddesk');
    this.buttonsBoards = boards.reduce((accum, board) => accum.concat(
      document.getElementById(`board-${board.id}`),
    ), []);
    this.checker = makeChecker(this);
  }

  addEventListeners() {
    this.photoAvatar.addEventListener('click', () => this.eventBus.call(MainPageEvent.profile));
    this.buttonAddDesk.addEventListener('click', () => this.eventBus.call(MainPageEvent.clickAddDesk, 'Новая доска'));
    this.buttonsBoards.forEach((buttonBoard) => buttonBoard.addEventListener(
      'click', () => this.eventBus.call(MainPageEvent.clickButtonBoard, buttonBoard.id),
    ));
  }

  renderNewBoard(board) {
    const newDocumentFragmentButtonBoard = document.createRange().createContextualFragment(
      // eslint-disable-next-line no-undef
      Handlebars.templates.mainPage({ ...board, single: true }),
    );
    this.buttonAddDesk.after(newDocumentFragmentButtonBoard);
    const newHTMLElementButtonBoard = this.buttonAddDesk.nextElementSibling;
    this.buttonsBoards = [newHTMLElementButtonBoard, ...this.buttonsBoards];
    newHTMLElementButtonBoard.addEventListener(
      'click', () => this.eventBus.call(MainPageEvent.clickButtonBoard, newHTMLElementButtonBoard.id),
    );
  }
}
