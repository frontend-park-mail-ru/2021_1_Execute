import {
  profileGet, boardGetById, taskGetById, rowCreate, taskCreate,
} from '../utils/requestToServer.js';
import { BoardPageEvent, BoardPageMessage } from './boardPageEvents.js';

export default class BoardPageModel {
  /**
   * @param {!EventBus}
   * @return {!ProfileModel}
   */
  constructor(eventBus) {
    this.eventBus = eventBus;
    this.eventBus.subscribe(BoardPageEvent.getData, (boardId) => this.getData(boardId));
    this.eventBus.subscribe(BoardPageEvent.openSettings, this.getBoardForSettings().bind(this));
    this.eventBus.subscribe(BoardPageEvent.openTask, (taskId) => this.getTask(taskId));
    this.eventBus.subscribe(BoardPageEvent.addToFavorite, this.addToFavorite().bind(this));
    this.eventBus.subscribe(BoardPageEvent.clickAddRow, (name) => this.addRow(name));
    this.eventBus.subscribe(BoardPageEvent.clickAddTask,
      (rowId, rowPosition, name) => this.addTask(rowId, rowPosition, name));
  }

  /**
   * Возвращяет обработанный список аватарок
   * @param {Object} board
   * @param {Object} board.users
   * @param {Object} board.users.owner
   * @param {Object} board.users.admins
   * @param {Object} board.users.members
   * @returns {Object} Объект с массивом аватарок и количеством скрытых аватарок
   */
  getAvatarsForView(board) {
    if (!(board && board.users && board.users.owner && board.users.admins && board.users.members)) {
      return {
        avatars: [],
        counter: 0,
      };
    }
    const users = [board.users.owner, ...board.users.admins, ...board.users.members];
    const maxAvatars = 3;
    const avatars = {};
    if (users.length > maxAvatars) {
      avatars.avatars = users.slice(0, maxAvatars);
      avatars.counter = users.length - maxAvatars;
    } else {
      avatars.avatars = users;
      avatars.counter = 0;
    }
    return avatars;
  }

  /**
   * @param {number} boardId
   */
  getData(boardId) {
    this.eventBus.call(BoardPageEvent.renderData);

    const callError = (error) => this.eventBus
      .call(BoardPageEvent.boardError, this.user, this.board, error);

    this.boardId = boardId;

    Promise.all([
      profileGet()
        .then((resp) => {
          switch (resp.status) {
            case 200:
              return resp.json();
            case 401:
              this.eventBus.call(BoardPageEvent.login);
              break;
            case 404:
              callError(BoardPageMessage.userUndefined);
              return { error: BoardPageMessage.userUndefined };
            default: {
              const err = { ...BoardPageMessage.unknownError };
              err.message += resp.status;
              callError(err);
              return { error: err };
            }
          }
          return undefined;
        }),
      boardGetById(boardId)
        .then((resp) => {
          switch (resp.status) {
            case 200:
              return resp.json();
            case 401:
              this.eventBus.call(BoardPageEvent.login);
              break;
            case 404:
              callError(BoardPageMessage.urlBrake);
              return { error: BoardPageMessage.urlBrake };
            default: {
              const err = { ...BoardPageMessage.unknownError };
              err.message += resp.status;
              callError(err);
              return { error: err };
            }
          }
          return undefined;
        }),
    ]).then(([{ user, error: userError }, { board, error: boardError }]) => {
      this.user = user;
      this.board = board;
      if (userError) {
        callError(userError);
      } else if (boardError) {
        callError(boardError);
      } else {
        const users = this.getAvatarsForView(board);
        this.eventBus.call(BoardPageEvent.renderData, user, board, users);
      }
    });
  }

  getBoardForSettings() {
    this.eventBus.call(BoardPageEvent.renderSettings, this.board);
  }

  /**
   * @param {number} taskId
   */
  getTask(taskId) {
    // eslint-disable-next-line no-console
    console.log('getTask:', taskId, this);
    taskGetById(taskId)
      .then((resp) => {
        switch (resp.status) {
          case 200:
            resp.json().then((task) => this.eventBus.call(BoardPageEvent.renderTask, task));
            break;
          case 401:
            this.eventBus.call(BoardPageEvent.login);
            break;
          default:
            this.eventBus.call(BoardPageEvent.boardError, `${BoardPageEvent.unknownError}: ${resp.status}`);
        }
      });
  }

  /**
   * @param {string} name
   */
  addRow(name) {
    const callError = (message) => this.eventBus.call(BoardPageEvent.boardsError, message);

    const position = Object.keys(this.board.rows).length;

    // eslint-disable-next-line no-console
    console.log('addRow:', name, this.boardId, position, this);

    rowCreate({ name, board_id: this.boardId, position })
      .then((resp) => {
        switch (resp.status) {
          case 200:
            return resp.json();
          case 401:
            this.eventBus.call(BoardPageEvent.login);
            break;
          case 400:
          default: {
            const err = { ...BoardPageMessage.unknownError };
            err.message += resp.status;
            callError(err);
            return { error: err };
          }
        }
        return undefined;
      })
      .then((row) => ({
        ...row, position, name, tasks: {},
      }))
      // eslint-disable-next-line no-return-assign
      .then((row) => (this.board.rows[position] = row))
      .then((row) => this.eventBus.call(BoardPageEvent.renderNewRow, row));
  }

  /**
   * @param {number} rowId
   * @param {number} rowPosition
   * @param {string} name
   */
  addTask(rowId, rowPosition, name) {
    const callError = (message) => this.eventBus.call(BoardPageEvent.boardsError, message);

    const position = Object.keys(this.board.rows[rowPosition].tasks).length;

    // eslint-disable-next-line no-console
    console.log('addTask:', name, rowId, position, this);

    taskCreate({ name, row_id: rowId, position })
      .then((resp) => {
        switch (resp.status) {
          case 200:
            return resp.json();
          case 401:
            this.eventBus.call(BoardPageEvent.login);
            break;
          case 400:
          default: {
            const err = { ...BoardPageMessage.unknownError };
            err.message += resp.status;
            callError(err);
            return { error: err };
          }
        }
        return undefined;
      })
      .then((task) => ({
        ...task, position, name,
      }))
      // eslint-disable-next-line no-return-assign
      .then((task) => (this.board.rows[rowPosition].tasks[position] = task))
      .then((task) => this.eventBus.call(BoardPageEvent.renderNewTask, task, rowPosition));
  }

  addToFavorite() {
    // todo
  }
}
