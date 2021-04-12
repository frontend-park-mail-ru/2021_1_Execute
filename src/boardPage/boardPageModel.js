import {
  profileGet, boardGetById, taskGetById, rowCreate, taskCreate, rowDelete, taskDelete, boardDelete,
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
    this.eventBus.subscribe(BoardPageEvent.openSettings, this.getBoardForSettings.bind(this));
    this.eventBus.subscribe(BoardPageEvent.openTask, (taskId) => this.getTask(taskId));
    this.eventBus.subscribe(BoardPageEvent.addToFavorite, this.addToFavorite.bind(this));
    this.eventBus.subscribe(BoardPageEvent.clickAddRow, (name) => this.addRow(name));
    this.eventBus.subscribe(BoardPageEvent.clickAddTask,
      (rowId, name) => this.addTask(rowId, name));
    this.eventBus.subscribe(BoardPageEvent.clickDeleteRow, (rowId) => this.deleteRow(rowId));
    this.eventBus.subscribe(BoardPageEvent.clickDeleteTask, (rowId) => this.deleteTask(rowId));
    this.eventBus.subscribe(BoardPageEvent.clickDeleteBoard, () => this.deleteBoard());
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
            resp.json().then((task) => this.eventBus.call(
              BoardPageEvent.renderTask, { ...task, id: taskId },
            ));
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
   * @param {string} name
   */
  addTask(rowId, name) {
    const callError = (message) => this.eventBus.call(BoardPageEvent.boardsError, message);

    const rowPosition = +Object.entries(this.board.rows).find(([, value]) => value.id === rowId)[0];
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

  /**
   * @param {number} rowId
   */
  deleteRow(rowId) {
    const callError = (message) => this.eventBus.call(BoardPageEvent.boardsError, message);
    const rowPosition = +Object.entries(this.board.rows).find(([, value]) => value.id === rowId)[0];

    // eslint-disable-next-line no-console
    console.log('deleteRow:', rowId, rowPosition, this);

    rowDelete(rowId)
      .then((resp) => {
        switch (resp.status) {
          case 200:
            return true;
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
      // eslint-disable-next-line no-return-assign
      .then(() => {
        const newRows = {
          ...Object
            .entries(this.board.rows)
            .slice(0, rowPosition)
            .reduce((accum, [key, value]) => {
              accum[key] = value;
              return accum;
            }, {}),
          ...Object
            .entries(this.board.rows)
            .slice(rowPosition + 1)
            .reduce((accum, [key, value]) => {
              accum[key - 1] = value;
              return accum;
            }, {}),
        };
        this.board.rows = newRows;
      })
      .then(() => this.eventBus.call(BoardPageEvent.renderDeleteRow, rowPosition));
  }

  /**
   * @param {number} taskId
   */
  deleteTask(taskId) {
    const callError = (message) => this.eventBus.call(BoardPageEvent.boardsError, message);
    let taskPosition;
    const rowPosition = +Object.entries(this.board.rows)
      // eslint-disable-next-line no-return-assign
      .find(([, { tasks }]) => !Number.isNaN(taskPosition = +Object.entries(tasks)
        .find(([, { id }]) => id === taskId)?.[0]))[0];
    taskPosition = +taskPosition;

    // eslint-disable-next-line no-console
    console.log('deleteTask:', taskId, taskPosition, rowPosition, this);

    taskDelete(taskId)
      .then((resp) => {
        switch (resp.status) {
          case 200:
            return true;
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
      // eslint-disable-next-line no-return-assign
      .then(() => {
        const newTasks = {
          ...Object
            .entries(this.board.rows[rowPosition].tasks)
            .slice(0, taskPosition)
            .reduce((accum, [key, value]) => {
              accum[key] = value;
              return accum;
            }, {}),
          ...Object
            .entries(this.board.rows[rowPosition].tasks)
            .slice(taskPosition + 1)
            .reduce((accum, [key, value]) => {
              accum[key - 1] = value;
              return accum;
            }, {}),
        };
        this.board.rows[rowPosition].tasks = newTasks;
      })
      .then(() => this.eventBus.call(BoardPageEvent.renderDeleteTask, rowPosition, taskPosition));
  }

  deleteBoard() {
    const callError = (message) => this.eventBus.call(BoardPageEvent.boardsError, message);

    // eslint-disable-next-line no-console
    console.log('deleteBoard:', this.boardId, this);

    boardDelete(this.boardId)
      .then((resp) => {
        switch (resp.status) {
          case 200:
            this.eventBus.call(BoardPageEvent.main);
            break;
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
      });
  }

  addToFavorite() {
    // todo
  }
}
