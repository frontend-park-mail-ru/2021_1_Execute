import './boardPage.handlebars.js';
import '../header/header.handlebars.js';
import './popupsTemplates/boardPopup.handlebars.js';
import { BoardPageEvent } from './boardPageEvents.js';

export default class BoardPageView {
  /**
     * @param {!EventBus}
     * @return {!ProfileView}
     */
  constructor(eventBus, root) {
    this.root = root;
    this.eventBus = eventBus;
    this.eventBus.subscribe(BoardPageEvent.renderData,
      (user, board, users) => this.renderData(user, board, users));
    // todo subscribe to new events
  }

  /**
     * @typedef {Object} board
     * @property {boolean} isStared
     * @property {string} name
     * @property {string} description
     * @property {row[]} rows
     * @property {users} users
     */

  /**
     * @typedef {Object} users
     * @param {participant} owner
     * @param {participant[]} admins
     * @param {participant[]} members
     */

  /**
     * @typedef {Object} participant
     * @param {number} id
     * @property {string} avatar
     */

  /**
     * @typedef {Object} user
     * @property {string} username
     * @property {string} email
     * @property {string} avatar
     */

  /**
     * @typedef {Object} row
     * @param {number} id
     * @param {number} position
     * @param {string} name
     * @param {taskOutter[]} tasks
     */

  /**
     * @typedef taskOutter
     * @param {string} name
     * @param {number} id
     * @param {number} position
     */

  /**
     * @typedef task
     * @param {string} name
     * @param {string} description
     */

  /**
     * @param {user} user
     * @param {board} board
     * @param {user[]} users Участники доски
     */
  renderData(user, board, users) {
    // eslint-disable-next-line no-undef
    this.root.innerHTML = Handlebars.templates.header(user);
    console.log(users);
    const maxAvatars = 4;
    const avatars = {};
    if (users.length > maxAvatars) {
      avatars.avatars = users.slice(0, maxAvatars);
      avatars.counter = users.length - maxAvatars;
    } else {
      avatars.avatars = users;
      avatars.counter = 0;
    }
    // eslint-disable-next-line no-undef
    this.root.innerHTML += Handlebars.templates.boardPage({ board, avatars });

    this.findNeedElem();
    this.addEventListeners(board);
  }

  /**
     * @param {board} board
     */

  findNeedElem() {
    this.photoAvatar = document.getElementById('avatar-photo');
    this.buttonSettings = document.getElementById('board-panel-settings');
    this.buttonFavorite = document.getElementById('btn-favorite');
    this.buttonInvite = document.getElementById('invite-bnt');
    this.buttonAddRow = document.getElementById('add-row-btn');
    // this.buttonsRows = (board.rows).reduce((accum, row) => accum.concat(
    //   document.getElementById(`add-card-to-${row.id}`),
    // ), []);
    this.popupContainer = document.getElementById('popup-container');
  }

  addEventListeners(board) {
    this.photoAvatar.addEventListener('click', () => this.eventBus.call(BoardPageEvent.profile));
    this.buttonSettings.addEventListener('click', () => this.openSettings(board));
    // this.buttonAddDesk.addEventListener('click', () => this.eventBus.call(
    //   BoardPageEvent.clickAddDesk, 'Новая доска',
    // ));
    // this.buttonsBoards.forEach((buttonBoard) => buttonBoard.addEventListener(
    //   'click', () => this.eventBus.call(BoardPageEvent.clickButtonBoard, buttonBoard.id),
    // ));
  }

  openSettings(board) {
    this.popupContainer.classList.remove('menu-hidden');
    // eslint-disable-next-line no-undef
    this.popupContainer.innerHTML = Handlebars.templates.boardPopup(board);
    this.buttonCloseSettings = document.getElementById('btn-close');
    this.buttonCloseSettings.addEventListener('click', () => this.closePopup());
  }

  closePopup() {
    this.popupContainer.innerHTML = '';
    this.popupContainer.classList.add('menu-hidden');
  }
}

/* todo Set overflow:hidden CSS attribute for <body> tag, when the popup is enabled and
    set it as auto when popup is disabled. */
