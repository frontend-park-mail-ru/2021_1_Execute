import './mainPage.handlebars.js';
import '../header/header.handlebars.js';
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
 * @property {!('guest'|'member'|'admin'|'owner')} access
 * @property {boolean} isStared
 * @property {string} name
 * @property {string} description
 */

  /**
 * @typedef {Object} boards
 * @property {board[]} guest
 * @property {board[]} member
 * @property {board[]} admin
 * @property {board[]} owner
 */

  /**
 * @typedef {Object} user
 * @property {string} username
 * @property {string} email
 * @property {string} avatar
 */

  /**
   * @param {user} user
   * @param {boards} boards
   */
  renderData(user, boards) {
    // eslint-disable-next-line no-undef
    this.root.innerHTML = Handlebars.templates.header(user);

    // eslint-disable-next-line no-undef
    this.root.innerHTML += Handlebars.templates.mainPage(boards);

    this.findNeedElem(boards);
    this.addEventListeners();
  }

  /**
   * @param {boards} boards
   */
  findNeedElem(boards) {
    this.buttonToMain = document.getElementById('logo');
    this.photoAvatar = document.getElementById('avatar-photo');
    this.buttonAddBoard = document.getElementById('addBoard');
    this.buttonsBoards = [
      ...boards.guest, ...boards.member,
      ...boards.admin, ...boards.owner,
    ]
      .reduce((accum, board) => accum.concat(
        document.getElementById(`board-${board.id}`),
      ), []);
  }

  addEventListeners() {
    this.buttonToMain.addEventListener('click', () => this.eventBus.call(MainPageEvent.main));
    this.photoAvatar.addEventListener('click', () => this.eventBus.call(MainPageEvent.profile));
    this.buttonAddBoard.addEventListener('click', () => this.eventBus.call(MainPageEvent.clickAddBoard, 'Новая доска'));
    this.buttonsBoards.forEach((buttonBoard) => buttonBoard.addEventListener(
      'click', () => this.eventBus.call(MainPageEvent.openBoard, +buttonBoard.dataset.id),
    ));
  }

  renderNewBoard(board) {
    const newDocumentFragmentButtonBoard = document.createRange().createContextualFragment(
      // eslint-disable-next-line no-undef
      Handlebars.templates.mainPage({ ...board, single: true }),
    );
    this.buttonAddBoard.after(newDocumentFragmentButtonBoard);
    const newHTMLElementButtonBoard = this.buttonAddBoard.nextElementSibling;
    this.buttonsBoards = [newHTMLElementButtonBoard, ...this.buttonsBoards];
    newHTMLElementButtonBoard.addEventListener(
      'click', () => this.eventBus.call(MainPageEvent.openBoard, +newHTMLElementButtonBoard.dataset.id),
    );
  }
}
