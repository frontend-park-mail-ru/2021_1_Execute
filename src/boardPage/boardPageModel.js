import {
  profileGet, boardGetById, taskGetById, rowCreate, taskCreate, rowDelete,
  taskDelete, boardDelete, taskPatch,
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
    this.eventBus.subscribe(BoardPageEvent.clickDeleteBoard, this.deleteBoard.bind(this));
    this.eventBus.subscribe(BoardPageEvent.clickUpdateTask,
      (taskId, taskName, taskDescription) => this.updateTask(taskId, taskName, taskDescription));
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
      if (board) {
        const sorter = ({ position: p1 }, { position: p2 }) => p1 - p2;
        board.rows = Object.values(board.rows).sort(sorter); // нужен ли sort? уточнить у бека
        board.rows.forEach(({ tasks }, index, rows) => {
          rows[index].tasks = Object.values(tasks).sort(sorter); // нужен ли sort?
        });
        this.board = board;
      }
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
    this.eventBus.call(BoardPageEvent.renderPopupBoard, this.board);
  }

  /**
   * @param {number} rowId
   */
  getRowById(rowId) {
    return this.board.rows.find((row) => row.id === rowId);
  }

  /**
   * @param {number} taskId
   */
  getTaskAndRowByTaskId(taskId) {
    let task;
    const row = this.board.rows.find(({ tasks }) => {
      task = tasks.find(({ id }) => id === taskId);
      return task;
    });
    return { row, task };
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
            resp.json().then(({ task }) => this.eventBus.call(
              BoardPageEvent.renderPopupTask, { ...task, id: taskId },
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

    const position = this.board.rows.length;

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
      .then(({ id }) => ({
        id, position, name, tasks: [],
      }))
      .then((row) => {
        this.board.rows[row.position] = row;
        this.eventBus.call(BoardPageEvent.renderNewRow, row);
      });
  }

  /**
   * @param {number} rowId
   * @param {string} name
   */
  addTask(rowId, name) {
    const callError = (message) => this.eventBus.call(BoardPageEvent.boardsError, message);

    const row = this.getRowById(rowId);
    const position = row.tasks.length;

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
      .then(({ id }) => ({
        id, position, name,
      }))
      .then((task) => {
        row.tasks[task.position] = task;
        this.eventBus.call(BoardPageEvent.renderNewTask, task, row.position);
      });
  }

  /**
   * @param {number} rowId
   */
  deleteRow(rowId) {
    const callError = (message) => this.eventBus.call(BoardPageEvent.boardsError, message);

    const row = this.getRowById(rowId);

    // eslint-disable-next-line no-console
    console.log('deleteRow:', rowId, row.position, this);

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
      .then(() => {
        this.board.rows.splice(row.position, 1);
        this.board.rows.slice(row.position).forEach((iterRow) => {
          iterRow.position -= 1;
        });
      })
      .then(() => this.eventBus.call(BoardPageEvent.renderDeleteRow, rowId, row.position));
  }

  /**
   * @param {number} taskId
   */
  deleteTask(taskId) {
    const callError = (message) => this.eventBus.call(BoardPageEvent.boardsError, message);

    const { row, task } = this.getTaskAndRowByTaskId(taskId);

    // eslint-disable-next-line no-console
    console.log('deleteTask:', taskId, task.position, row.position, this);

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
      .then(() => {
        row.tasks.splice(task.position, 1);
        row.tasks.slice(task.position).forEach((iterTask) => {
          iterTask.position -= 1;
        });
      })
      .then(() => this.eventBus.call(BoardPageEvent.renderDeleteTask, taskId));
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

  /**
   * @param {Object} task
   * @param {number} task.id
   * @param {string} task.name
   * @param {string} task.description
   */
  updateTask(task) {
    const callError = (message) => this.eventBus.call(BoardPageEvent.boardError, message);

    // eslint-disable-next-line no-console
    console.log('updateTask:', { task });
    taskPatch({
      name: task.name,
      description: task.description,
    }, task.id)
      .then((resp) => {
        switch (resp.status) {
          case 200:
            this.eventBus.call(BoardPageEvent.renderUpdateTask, { id: task.id, name: task.name });
            break;
          case 401:
            this.eventBus.call(BoardPageEvent.login);
            break;
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
