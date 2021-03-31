import { profileGet, boardsGet, boardCreate } from '../utils/requestToServer.js';
import { MainPageEvent } from './mainPageEvents.js';

export default class MainPageModel {
  /**
   * @param {!EventBus}
   * @return {!ProfileModel}
   */
  constructor(eventBus) {
    this.eventBus = eventBus;
    this.eventBus.subscribe(MainPageEvent.getData, () => this.getData());
    this.eventBus.subscribe(MainPageEvent.clickAddDesk, (name) => this.clickAddDesk(name));
    this.eventBus.subscribe(MainPageEvent.clickButtonBoard,
      (boardId) => this.clickButtonBoard(boardId));
  }

  getData() {
    const callProfileError = (message) => this
      .eventBus.call(MainPageEvent.headerError, message);
    const callBoardsError = (message) => this
      .eventBus.call(MainPageEvent.boardsError, message);

    Promise.all([
      profileGet()
        .then((resp) => {
          switch (resp.status) {
            case 200:
              return resp.json();
            case 401:
              throw this.eventBus.call(MainPageEvent.login);
            case 404:
              throw callProfileError(MainPageEvent.userUndefind);
            default:
              throw callProfileError(`${MainPageEvent.unknownError}: ${resp.status}`);
          }
        }),
      boardsGet()
        .then((resp) => {
          switch (resp.status) {
            case 200:
              return resp.json();
            case 401:
              throw this.eventBus.call(MainPageEvent.login);
            default:
              throw callBoardsError(`${MainPageEvent.unknownError}: ${resp.status}`);
          }
        }),
    ]).then(([{ user }, { boards }]) => this.eventBus.call(MainPageEvent.renderData, user, boards));
  }

  clickButtonBoard(boardNameId) {
    // eslint-disable-next-line no-console
    console.log('clickButtonBoard:', boardNameId, +boardNameId.slice(6), this);
  }

  clickAddDesk(name) {
    // eslint-disable-next-line no-console
    console.log('clickAddDesk:', name, this);
    const callError = (message) => this.eventBus.call(MainPageEvent.boardsError, message);

    boardCreate(name)
      .then((resp) => {
        switch (resp.status) {
          case 200:
            return resp.json();
          case 400:
            throw this.eventBus.call(MainPageEvent.unknownError);
          case 401:
            throw this.eventBus.call(MainPageEvent.login);
          default:
            throw callError(`${MainPageEvent.unknownError}: ${resp.status}`);
        }
      })
      .then((board) => ({ ...board, name }))
      .then((board) => this.eventBus.call(MainPageEvent.renderNewBoard, board));
  }
}
