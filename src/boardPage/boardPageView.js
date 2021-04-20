import boardTemplate from './boardPage.handlebars';
import headerTemplate from '../header/header.handlebars';
import boardPopupTemplate from './popupsTemplates/boardPopup.handlebars';
import taskPopupTemplate from './popupsTemplates/taskPopup.handlebars';
import { BoardPageEvent } from './boardPageEvents.js';
import '../css/board.css';

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
    this.eventBus.subscribe(BoardPageEvent.renderPopupBoard,
      (board) => this.renderPopupBoard(board));
    this.eventBus.subscribe(BoardPageEvent.renderPopupTask,
      (task) => this.renderPopupTask(task));
    this.eventBus.subscribe(BoardPageEvent.renderNewTask,
      (task, rowId) => this.renderNewTask(task, rowId));
    this.eventBus.subscribe(BoardPageEvent.renderNewRow, (row) => this.renderNewRow(row));
    this.eventBus.subscribe(BoardPageEvent.renderDeleteRow,
      (rowId, rowPosition) => this.renderDeleteRow(rowId, rowPosition));
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
    this.root.innerHTML = headerTemplate(user);
    this.root.innerHTML += boardTemplate({ board, avatars, error });

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

  renderPopupTask(task) {
    this.popupContainer.innerHTML = taskPopupTemplate(task);
    // todo вынести таску в отдельную модель

    this.popupContainer.classList.remove('menu-hidden');
    document.body.classList.add('root-while-popup');

    const buttonClose = document.getElementById('btn-close');
    buttonClose.addEventListener('click', () => this.closePopup());

    const buttonsTaskDelete = document.getElementById(`task-delete-${task.id}`);
    buttonsTaskDelete.addEventListener('click',
      () => this.eventBus.call(BoardPageEvent.clickDeleteTask, +buttonsTaskDelete.dataset.id));
  }

  renderPopupBoard(board) {
    this.popupContainer.innerHTML = boardPopupTemplate(board);

    this.popupContainer.classList.remove('menu-hidden');
    document.body.classList.add('root-while-popup');

    const buttonClose = document.getElementById('btn-close');
    buttonClose.addEventListener('click', () => this.closePopup());

    const buttonsBoardDelete = document.getElementById('board-delete');
    buttonsBoardDelete.addEventListener('click',
      () => this.eventBus.call(BoardPageEvent.clickDeleteBoard));
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
      boardTemplate({ ...row, singleRow: true }),
    );
    document.getElementById('add-row-btn').before(newDocumentFragmentRow);
    const newHTMLElementAddTask = document.getElementById(`add-card-to-${row.id}`);
    newHTMLElementAddTask.addEventListener(
      'click', () => this.eventBus.call(
        BoardPageEvent.clickAddTask, +newHTMLElementAddTask.dataset.id, 'Новая задача',
      ),
    );
    this.buttonsAddTask.push(newHTMLElementAddTask);
    const newHTMLElementRowDelete = document.getElementById(`row-delete-${row.id}`);
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
      boardTemplate({ ...task, singleTask: true }),
    );
    document.getElementsByClassName('row-body')[rowPosition].append(newDocumentFragmentTask);
    const newHTMLElementTask = document.getElementById(`task-${task.id}`);
    newHTMLElementTask.addEventListener(
      'click', () => this.eventBus.call(BoardPageEvent.openTask, +newHTMLElementTask.dataset.id),
    );
    this.buttonsTask.push(newHTMLElementTask);
  }

  /**
   * @param {number} rowId
   * @param {number} rowPosition
   */
  renderDeleteRow(rowId, rowPosition) {
    document.getElementById(`row-${rowId}`).remove();
    this.buttonsAddTask.splice(rowPosition, 1);
    this.buttonsRowDelete.splice(rowPosition, 1);
  }

  /**
   * @param {number} taskId
   */
  renderDeleteTask(taskId) {
    this.closePopup();
    document.getElementById(`task-${taskId}`).remove();
  }
}
