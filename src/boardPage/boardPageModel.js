import {
  profileGet, boardGetById, taskGetById, rowCreate,
} from '../utils/requestToServer.js';
import { BoardPageEvent, BoardPageMessage } from './boardPageEvents.js';

export default class BoardPageModel {
  /**
   * @param {!EventBus}
   * @return {!ProfileModel}
   */
  constructor(eventBus) {
    this.eventBus = eventBus;
    this.eventBus.subscribe(BoardPageEvent.getData, (...all) => this.getData(...all));
    this.eventBus.subscribe(BoardPageEvent.openSettings,
      (...all) => this.getBoardForSettings(...all));
    this.eventBus.subscribe(BoardPageEvent.openTask, (...all) => this.getTask(...all));
    this.eventBus.subscribe(BoardPageEvent.addToFavorite, (...all) => this.addToFavorite(...all));
    this.eventBus.subscribe(BoardPageEvent.clickAddRow, (...all) => this.addRow(...all));
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
    console.log(this, boardId);
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
      }
      if (boardError) {
        callError(boardError);
      }
      if (!user || !board) {
        return;
      }
      const users = this.getAvatarsForView(board);
      this.eventBus.call(BoardPageEvent.renderData, user, board, users);
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
    // eslint-disable-next-line no-console
    console.log('addRow:', name, this);
    const callError = (message) => this.eventBus.call(BoardPageEvent.boardsError, message);

    const position = Object.keys(this.board.rows).length;

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
        ...row, position, name, tasks: [],
      }))
      .then((row) => this.eventBus.call(BoardPageEvent.renderNewRow, row));
  }

  addToFavorite() {
    // todo
  }
}
