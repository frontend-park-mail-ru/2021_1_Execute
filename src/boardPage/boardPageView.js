import './boardPage.handlebars.js';
import '../header/header.handlebars.js';
import './popupsTemplates/boardPopup.handlebars.js';
import './popupsTemplates/taskPopup.handlebars.js';
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
    this.eventBus.subscribe(BoardPageEvent.renderSettings,
      (board) => this.renderPopup(board, false));
    this.eventBus.subscribe(BoardPageEvent.renderTask, (task) => this.renderPopup(task, true));
    this.eventBus.subscribe(BoardPageEvent.boardError,
      (message) => this.boardErrorHandler(message));
    this.eventBus.subscribe(BoardPageEvent.headerError,
      (message) => this.boardErrorHandler(message));
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
   * @param {user[]} avatars Данные для панели с аватарками
   */
  renderData(user, board, avatars) {
    // eslint-disable-next-line no-undef
    this.root.innerHTML = Handlebars.templates.header(user);
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
    this.buttonsTask = document.getElementsByClassName('task');
    [...this.buttonsTask].forEach((element) => element.addEventListener('click', (e) => {
      const id = parseInt(e.currentTarget.id?.replace('task-', ''), 10);

      if (!Number.isNaN(id)) {
        this.eventBus.call(BoardPageEvent.openTask, id);
      }
    }));
    this.popupContainer = document.getElementById('popup-container');
  }

  addEventListeners() {
    this.photoAvatar.addEventListener('click', () => this.eventBus.call(BoardPageEvent.profile));
    this.buttonSettings.addEventListener('click', () => this.eventBus.call(BoardPageEvent.openSettings));
    this.buttonFavorite.addEventListener('click', this.addToFavorite);
  }

  renderPopup(data, isTask) {
    if (isTask) {
      // eslint-disable-next-line no-undef
      this.popupContainer.innerHTML = Handlebars.templates.taskPopup(data);
      // todo вынести таску в отдельную модель
    } else {
      // eslint-disable-next-line no-undef
      this.popupContainer.innerHTML = Handlebars.templates.boardPopup(data);
    }
    this.popupContainer.classList.remove('menu-hidden');
    document.body.classList.add('root-while-popup');

    this.buttonClose = document.getElementById('btn-close');
    this.buttonClose.addEventListener('click', () => this.closePopup());
  }

  closePopup() {
    this.popupContainer.innerHTML = '';
    this.popupContainer.classList.add('menu-hidden');
    document.body.classList.remove('root-while-popup');
  }

  addToFavorite() {
    const polygon = document.getElementById('btn-favorite-polygon');
    polygon.classList.toggle('btn-favorite-selected');
    polygon.classList.toggle('btn-favorite-unselected');
    this.eventBus.call(BoardPageEvent.addToFavorite);
  }

  boardErrorHandler(message) {
    // eslint-disable-next-line no-alert
    alert(message);
  }
}
