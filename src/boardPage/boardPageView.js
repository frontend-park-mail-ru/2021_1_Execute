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
      (user, boards) => this.renderData(user, boards));
    // todo subscribe to new events
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
     * @param {participant} owner
     * @param {participant[]} admins
     * @param {participant[]} members
     */

  /**
     * @typedef {Object} participant
     * @param {number} id
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
     * @param {number} id
     * @param {number} position
     * @param {string} name
     * @param {taskOutter[]} tasks
     */

  /**
     * @typedef taskOutter
     * @param {string} name
     * @param {number} id
     * @param {number} position
     */

  /**
     * @typedef task
     * @param {string} name
     * @param {string} description
     */

  /**
     * @param {user} user
     * @param {board} board
     */

  /**
     * Returns avatars format for template
     * @param {board} board
     * @returns {Object}
     */
  getAvatars(board) {
    const maxAvatars = 5;
    if (!(board && board.users && board.users.owner && board.users.admins && board.users.members)) {
      return {
        avatars: [],
        isMore: false,
        counter: 0,
      };
    }
    let avatars = [board.users.owner];
    avatars = avatars.concat(board.users.admins, board.users.members);
    if (avatars.length > maxAvatars) {
      return {
        avatars: avatars.slice(0, maxAvatars),
        isMore: true,
        counter: avatars.length - maxAvatars,
      };
    }
    return {
      avatars,
      isMore: false,
      counter: 0,
    };
  }

  renderData(user, board) {
    // eslint-disable-next-line no-undef
    // this.root.innerHTML = Handlebars.templates.header(user);

    const avatars = this.getAvatars(board);
    console.log(avatars, board);
    // eslint-disable-next-line no-undef
    this.root.innerHTML = Handlebars.templates.boardPage({ board, avatars });

    // this.findNeedElem(boards);
    // this.addEventListeners(boards);
  }

  /**
     * @param {board[]} boards
     */
  /*
  findNeedElem(boards) {
    this.photoAvatar = document.getElementById('avatar-photo');
    this.buttonAddDesk = document.getElementById('adddesk');
    this.buttonsBoards = boards.reduce((accum, board) => accum.concat(
      document.getElementById(`board-${board.id}`),
    ), []);
  }

  addEventListeners() {
    this.photoAvatar.addEventListener('click', () => this.eventBus.call(BoardPageEvent.profile));
    this.buttonAddDesk.addEventListener('click', () => this.eventBus.call(
        BoardPageEvent.clickAddDesk, 'Новая доска'));
    this.buttonsBoards.forEach((buttonBoard) => buttonBoard.addEventListener(
      'click', () => this.eventBus.call(BoardPageEvent.clickButtonBoard, buttonBoard.id),
    ));
  }

  renderNewBoard(board) {
  } */
}

/* todo Set overflow:hidden CSS attribute for <body> tag, when the popup is enabled and
    set it as auto when popup is disabled. */
