import { profileGet, boardGetById, taskGetById } from '../utils/requestToServer.js';
import { BoardPageEvent, BoardPageMessage } from './boardPageEvents.js';

export default class BoardPageModel {
  /**
   * @param {!EventBus}
   * @return {!ProfileModel}
   */
  constructor(eventBus) {
    this.eventBus = eventBus;
    this.eventBus.subscribe(BoardPageEvent.getData, (boardId) => this.getData(boardId));
    this.eventBus.subscribe(BoardPageEvent.openSettings,
      () => this.getBoardForSettings());
    this.eventBus.subscribe(BoardPageEvent.openTask, (id) => this.getTask(id));
    this.eventBus.subscribe(BoardPageEvent.addToFavorite, this.addToFavorite);
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

  getData(boardId) {
    this.boardId = boardId;

    const callProfileError = (message) => this
      .eventBus.call(BoardPageEvent.headerError, message);
    const callBoardError = (message) => this
      .eventBus.call(BoardPageEvent.boardError, message);

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
              callProfileError(BoardPageMessage.userUndefind);
              break;
            default:
              callProfileError(`${BoardPageMessage.unknownError}: ${resp.status}`);
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
            default:
              callBoardError(`${BoardPageMessage.unknownError}: ${resp.status}`);
          }
          return undefined;
        }),
    ]).then(([{ user }, { board }]) => {
      if (!user || !board) {
        return;
      }
      this.board = board;
      const users = this.getAvatarsForView(board);
      this.eventBus.call(BoardPageEvent.renderData, user, board, users);
    });
  }

  getBoardForSettings() {
    this.eventBus.call(BoardPageEvent.renderSettings, this.board);
  }

  getTask(taskId) {
    taskGetById(taskId)
      .then((resp) => {
        switch (resp.status) {
          case 200:
            this.eventBus.call(BoardPageEvent.renderTask, resp.json());
            break;
          case 401:
            this.eventBus.call(BoardPageEvent.login);
            break;
          default:
            this.eventBus.call(BoardPageEvent.boardError, `${BoardPageEvent.unknownError}: ${resp.status}`);
        }
      });
  }

  addToFavorite() {
    // todo
  }
}
