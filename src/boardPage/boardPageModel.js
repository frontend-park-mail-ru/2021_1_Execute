import { profileGet, boardGetById } from '../utils/requestToServer.js';
import { BoardPageEvent } from './boardPageEvents.js';

export default class BoardPageModel {
  /**
   * @param {!EventBus}
   * @return {!ProfileModel}
   */
  constructor(eventBus) {
    this.eventBus = eventBus;
    this.eventBus.subscribe(BoardPageEvent.getData, (boardId) => this.getData(boardId));
    this.eventBus.subscribe(BoardPageEvent.clickButtonBoard,
      (boardId) => this.clickButtonBoard(boardId));
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
              console.log(resp, 'respw');
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
              console.log(resp, 'resp');
              return resp.json();
            case 401:
              throw this.eventBus.call(BoardPageEvent.login);
            default:
              throw callBoardError(`${BoardPageEvent.unknownError}: ${resp.status}`);
          }
        }),
    ]).then(([{ user }, { board }]) => {
      console.log(board, 'get');
      this.eventBus.call(BoardPageEvent.renderData, user, board);
    });
  }

  /* clickButtonBoard(boardNameId) {
    console.log('clickButtonBoard:', boardNameId, +boardNameId.slice(6), this);
  }

  clickAddDesk(name) {
    console.log('clickAddDesk:', name, this);
    const callError = (message) => this.eventBus.call(BoardPageEvent.boardsError, message);

    boardCreate(name)
      .then((resp) => {
        switch (resp.status) {
          case 200:
            return resp.json();
          case 400:
            throw this.eventBus.call(BoardPageEvent.unknownError);
          case 401:
            throw this.eventBus.call(BoardPageEvent.login);
          default:
            throw callError(`${BoardPageEvent.unknownError}: ${resp.status}`);
        }
      })
      .then((board) => ({ ...board, name }))
      .then((board) => this.eventBus.call(BoardPageEvent.renderNewBoard, board));
  } */
}
