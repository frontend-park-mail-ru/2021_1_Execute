import { profileGet, boardGetById, taskGetById } from '../utils/requestToServer.js';
import { BoardPageEvent } from './boardPageEvents.js';

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
    this.eventBus.subscribe(BoardPageEvent.addToFavorite, () => this.addToFavorite());
  }

  getAvatarsForView(board) {
    if (!(board && board.users && board.users.owner && board.users.admins && board.users.members)) {
      return {
        avatars: [],
        counter: 0,
      };
    }
    const avatars = [board.users.owner];
    return avatars.concat(board.users.admins, board.users.members);
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
              throw this.eventBus.call(BoardPageEvent.login);
            case 404:
              throw callProfileError(BoardPageEvent.userUndefind);
            default:
              throw callProfileError(`${BoardPageEvent.unknownError}: ${resp.status}`);
          }
        }),
      boardGetById(boardId)
        .then((resp) => {
          switch (resp.status) {
            case 200:
              return resp.json();
            case 401:
              throw this.eventBus.call(BoardPageEvent.login);
            default:
              throw callBoardError(`${BoardPageEvent.unknownError}: ${resp.status}`);
          }
        }),
    ]).then(([{ user }, { board }]) => {
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
            return resp.json();
          case 401:
            throw this.eventBus.call(BoardPageEvent.login);
          default:
            throw this.eventBus.call(BoardPageEvent.boardError, `${BoardPageEvent.unknownError}: ${resp.status}`);
        }
      })
      .then((task) => this.eventBus.call(BoardPageEvent.renderTask, task));
  }

  addToFavorite() {
    // todo
  }
}
