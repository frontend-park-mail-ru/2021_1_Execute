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
    this.eventBus.subscribe(BoardPageEvent.renderNewTask,
      (task, rowId) => this.renderNewTask(task, rowId));
    this.eventBus.subscribe(BoardPageEvent.renderNewRow, (row) => this.renderNewRow(row));
    this.eventBus.subscribe(BoardPageEvent.renderDeleteRow,
      (rowPosition) => this.renderDeleteRow(rowPosition));
    this.eventBus.subscribe(BoardPageEvent.renderDeleteTask,
      (rowPosition, taskPosition) => this.renderDeleteTask(rowPosition, taskPosition));
    this.eventBus.subscribe(BoardPageEvent.headerError,
      (user, board, error) => this.boardErrorBoard(user, board, error));
    this.eventBus.subscribe(BoardPageEvent.boardError,
      (user, board, error) => this.boardErrorBoard(user, board, error));
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
   * @property {participant} owner
   * @property {participant[]} admins
   * @property {participant[]} members
   */

  /**
   * @typedef {Object} participant
   * @property {number} id
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
   * @property {number} id
   * @property {number} position
   * @property {string} name
   * @property {taskOutter[]} tasks
   */

  /**
   * @typedef {Object} taskOutter
   * @property {string} name
   * @property {number} id
   * @property {number} position
   */

  /**
   * @typedef {Object} task
   * @property {string} name
   * @property {string} description
   */

  /**
   * @param {?user} user
   * @param {?board} board
   * @param {?user[]} avatars Данные для панели с аватарками
   * @param {?Object} error
   */
  renderData(user, board, avatars, error) {
    // eslint-disable-next-line no-undef
    this.root.innerHTML = Handlebars.templates.header(user);
    // eslint-disable-next-line no-undef
    this.root.innerHTML += Handlebars.templates.boardPage({ board, avatars, error });

    this.findNeedElem();
    this.addEventListeners();
  }

  findNeedElem() {
    this.photoAvatar = document.getElementById('avatar-photo');
    this.buttonSettings = document.getElementById('board-panel-settings');
    this.buttonFavorite = document.getElementById('btn-favorite');
    this.buttonInvite = document.getElementById('invite-bnt');
    this.buttonAddRow = document.getElementById('add-row-btn');
    this.buttonsTask = [...document.getElementsByClassName('task')];
    this.buttonsAddTask = [...document.getElementsByClassName('add-card-button')];
    this.buttonsRowDelete = [...document.getElementsByClassName('row-delete')];
    this.popupContainer = document.getElementById('popup-container');
  }

  addEventListeners() {
    this.photoAvatar?.addEventListener('click', () => this.eventBus.call(BoardPageEvent.profile));
    this.buttonSettings?.addEventListener('click', () => this.eventBus.call(BoardPageEvent.openSettings));
    this.buttonFavorite?.addEventListener('click', this.addToFavorite);
    this.buttonAddRow?.addEventListener('click', () => this.eventBus.call(BoardPageEvent.clickAddRow, 'Новая колонка'));
    this.buttonsTask.forEach((elem) => elem.addEventListener(
      'click', () => this.eventBus.call(BoardPageEvent.openTask, +elem.dataset.id),
    ));
    this.buttonsAddTask.forEach((elem) => elem.addEventListener(
      'click', () => this.eventBus.call(BoardPageEvent.clickAddTask, +elem.dataset.id, 'Новая задача'),
    ));
    this.buttonsRowDelete.forEach((elem) => elem.addEventListener(
      'click', () => this.eventBus.call(BoardPageEvent.clickDeleteRow, +elem.dataset.id),
    ));
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
    this.buttonClose?.addEventListener('click', () => this.closePopup());

    if (isTask) {
      [this.buttonsTaskDelete] = document.getElementsByClassName('task-delete');
      this.buttonsTaskDelete.addEventListener('click',
        () => this.eventBus.call(
          BoardPageEvent.clickDeleteTask, +this.buttonsTaskDelete.dataset.id,
        ));
    } else {
      [this.buttonsBoardDelete] = document.getElementsByClassName('board-delete');
      this.buttonsBoardDelete.addEventListener('click',
        () => this.eventBus.call(BoardPageEvent.clickDeleteBoard));
    }
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

  boardErrorBoard(user, board, error) {
    this.renderData(user, board, null, error);
  }

  /**
   * @param {row} row
   */
  renderNewRow(row) {
    const newDocumentFragmentRow = document.createRange().createContextualFragment(
      // eslint-disable-next-line no-undef
      Handlebars.templates.boardPage({ ...row, singleRow: true }),
    );
    this.buttonAddRow.before(newDocumentFragmentRow);
    const newHTMLElementRow = this.buttonAddRow.previousElementSibling;
    const newHTMLElementAddTask = newHTMLElementRow.lastElementChild;
    newHTMLElementAddTask.addEventListener(
      'click', () => this.eventBus.call(
        BoardPageEvent.clickAddTask, +newHTMLElementAddTask.dataset.id, 'Новая задача',
      ),
    );
    this.buttonsAddTask.push(newHTMLElementAddTask);
    const newHTMLElementRowDelete = newHTMLElementRow.firstElementChild.lastElementChild;
    newHTMLElementRowDelete.addEventListener(
      'click', () => this.eventBus.call(BoardPageEvent.clickDeleteRow, +newHTMLElementRowDelete.dataset.id),
    );
    this.buttonsRowDelete.push(newHTMLElementRowDelete);
  }

  /**
   * @param {taskOutter} task
   * @param {number} rowPosition
   */
  renderNewTask(task, rowPosition) {
    const newDocumentFragmentTask = document.createRange().createContextualFragment(
      // eslint-disable-next-line no-undef
      Handlebars.templates.boardPage({ ...task, singleTask: true }),
    );
    this.buttonsAddTask[rowPosition].previousElementSibling.append(newDocumentFragmentTask);
    const newHTMLElementTask = this.buttonsAddTask[rowPosition]
      .previousElementSibling.lastElementChild;
    newHTMLElementTask.addEventListener(
      'click', () => this.eventBus.call(BoardPageEvent.openTask, +newHTMLElementTask.dataset.id),
    );
    this.buttonsTask.push(newHTMLElementTask);
  }

  /**
   * @param {number} rowPosition
   */
  renderDeleteRow(rowPosition) {
    this.buttonsRowDelete[rowPosition].parentElement.parentElement.remove();
    delete this.buttonsAddTask[rowPosition];
    this.buttonsAddTask = this.buttonsAddTask.filter(() => true);
    delete this.buttonsRowDelete[rowPosition];
    this.buttonsRowDelete = this.buttonsRowDelete.filter(() => true);
  }

  /**
   * @param {number} rowPosition
   * @param {number} taskPosition
   */
  renderDeleteTask(rowPosition, taskPosition) {
    this.closePopup();
    const needTask = this.buttonsRowDelete[rowPosition].parentElement
      .nextElementSibling.children[taskPosition];
    needTask.remove();
  }
}
