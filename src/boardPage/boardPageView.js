import './boardPage.handlebars.js';
import '../header/header.handlebars.js';
import './popupsTemplates/boardPopup.handlebars.js';
import './popupsTemplates/taskPopup.handlebars.js';
import { BoardPageEvent } from './boardPageEvents.js';
import { replaceObjectPropForNSeconds } from '../utils/temporaryReplacement.js';

/**
 * @param {HTMLElement} task
 * @param {number} height
 */
const fixHeight = (task, height) => {
  task.style.height = `${height}px`;
  task.style['min-height'] = task.style.height;
  task.style['max-height'] = task.style.height;
};

/**
 * @param {HTMLElement} task
 * @param {number} width
 */
const fixWidth = (task, width) => {
  task.style.width = `${width}px`;
  task.style['min-width'] = task.style.width;
  task.style['max-width'] = task.style.width;
};

/**
 * @param {HTMLElement} task
 * @return {HTMLElement}
 */
const createGhostTask = (task) => {
  const ghostTask = document.createElement('div');
  ghostTask.classList.add('task-ghost-dnd');
  fixHeight(ghostTask, task.offsetHeight);
  fixWidth(ghostTask, task.offsetWidth);
  return ghostTask;
};

/**
 * @param {HTMLElement} task
 * @return {{x:number,y:number}}
 */
const getCenter = (task) => ({
  x: task.offsetLeft + task.offsetWidth / 2,
  y: task.offsetTop + task.offsetHeight / 2,
});

const delta = ({ x: x1, y: y1 }, { x: x2, y: y2 }) => ({ x: (x1 - x2), y: (y1 - y2) });

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
    this.eventBus.subscribe(BoardPageEvent.renderUpdateTask,
      (taskInfo) => this.renderUpdateTask(taskInfo));
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
   * @property {taskOuter[]} tasks
   */

  /**
   * @typedef {Object} taskOuter
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
    // eslint-disable-next-line no-undef
    this.root.innerHTML = Handlebars.templates.header(user);
    // eslint-disable-next-line no-undef
    this.root.innerHTML += Handlebars.templates.boardPage({ board, avatars, error });

    this.findNeedElem();
    this.addEventListeners();
    this.addDnDForTasks();
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
    this.buttonsTask.forEach((elem) => {
      elem.onclick = () => this.eventBus.call(BoardPageEvent.openTask, +elem.dataset.id);
    });
    this.buttonsAddTask.forEach((elem) => elem.addEventListener(
      'click', () => this.eventBus.call(BoardPageEvent.clickAddTask, +elem.dataset.id, 'Новая задача'),
    ));
    this.buttonsRowDelete.forEach((elem) => elem.addEventListener(
      'click', () => this.eventBus.call(BoardPageEvent.clickDeleteRow, +elem.dataset.id),
    ));
  }

  addDnDForTasks() {
    [...document.getElementsByClassName('task')].forEach((task) => this.addDnDForTask(task));
  }

  /**
   * @param {HTMLElement} task
   */
  addDnDForTask(task) {
    task.onmousedown = (onMouseDownEvent) => {
      const shiftX = onMouseDownEvent.offsetX;
      const shiftY = onMouseDownEvent.offsetY;

      const ghostTask = createGhostTask(task);

      document.body.style.overflow = 'hidden';

      const moveAt = (pageX, pageY) => {
        task.style.left = `${pageX - shiftX}px`;
        task.style.top = `${pageY - shiftY}px`;
      };

      const bufOnclick = task.onclick;
      let firstOnMouseMove = true;
      const allRows = [...document.getElementsByClassName('row-body')];
      let toLeft;
      let toRight;
      let toUp;
      let toDown;

      function onMouseMove(onMouseMoveEvent) {
        if (firstOnMouseMove) {
          task.after(ghostTask);
          fixHeight(task, task.offsetHeight - 20);
          fixWidth(task, task.offsetWidth - 20);
          task.classList.replace('task', 'task-dnd');
          task.onclick = () => { };
        }

        moveAt(onMouseMoveEvent.pageX, onMouseMoveEvent.pageY);
        const correctCenterTask = getCenter(task);
        correctCenterTask.x += document.getElementById('rows-container').scrollLeft;

        const [bestRow] = allRows
          .reduce(([ans, bestCost], iterRow) => {
            const cost = delta(getCenter(iterRow), correctCenterTask);
            return Math.abs(cost.x) < Math.abs(bestCost.x)
              ? [iterRow, cost]
              : [ans, bestCost];
          }, [undefined, { x: Infinity, y: Infinity }]);

        correctCenterTask.y += bestRow.scrollTop;

        const [bestTask] = [...bestRow.getElementsByClassName('task')]
          .reduce(([ans, bestCost], iterTask) => {
            const cost = delta(getCenter(iterTask), correctCenterTask);
            return Math.abs(cost.y) < Math.abs(bestCost.y)
              ? [iterTask, cost]
              : [ans, bestCost];
          }, [undefined, { x: Infinity, y: Infinity }]);
        bestTask.after(ghostTask);

        if (task.getBoundingClientRect().right > document.body.offsetWidth - 10) {
          if (!toRight) {
            toRight = setInterval(() => {
              document.getElementById('rows-container').scrollBy(
                (task.getBoundingClientRect().right - document.body.offsetWidth + 10)
                ** 0.5 * 0.5, 0,
              );
            }, 1);
          }
        } else {
          toRight = clearInterval(toRight);
        }

        if (task.getBoundingClientRect().left < 10) {
          if (!toLeft) {
            toLeft = setInterval(() => {
              document.getElementById('rows-container').scrollBy(
                -((10 - task.getBoundingClientRect().left)
                  ** 0.5 * 0.5), 0,
              );
            }, 1);
          }
        } else {
          toLeft = clearInterval(toLeft);
        }

        if (task.getBoundingClientRect().top < bestRow.offsetTop) {
          if (!toUp) {
            toUp = setInterval(() => {
              bestRow.scrollBy(
                0, -((bestRow.offsetTop - task.getBoundingClientRect().top) ** 0.5),
              );
            }, 1);
          }
        } else {
          toUp = clearInterval(toUp);
        }

        if (task.getBoundingClientRect().bottom > bestRow.offsetTop + bestRow.offsetHeight) {
          if (!toDown) {
            toDown = setInterval(() => {
              bestRow.scrollBy(
                0, (task.getBoundingClientRect().bottom - bestRow.offsetTop - bestRow.offsetHeight)
              ** 0.5,
              );
            }, 1);
          }
        } else {
          toDown = clearInterval(toDown);
        }

        firstOnMouseMove = false;
      }

      document.addEventListener('mousemove', onMouseMove);

      window.onmouseup = () => {
        task.classList.replace('task-dnd', 'task');
        document.removeEventListener('mousemove', onMouseMove);
        ghostTask.after(task);
        ghostTask.remove();
        const newRowId = task.parentNode.dataset.id;
        const newPosition = [...task.parentElement.children].indexOf(task) - 1;
        this.eventBus.call(BoardPageEvent.moveTask, {
          taskId: +task.dataset.id,
          newRowId: +newRowId,
          newPosition,
        });
        window.onmouseup = null;
        task.style = '';
        document.body.style.overflow = '';
        setTimeout(() => {
          task.onclick = bufOnclick;
        }, 0.1);
        replaceObjectPropForNSeconds(task.style, 'transition', 'none', {}, 0.1);
      };
    };

    task.ondragstart = () => false;
  }

  renderPopupTask(task) {
    // eslint-disable-next-line no-undef
    this.popupContainer.innerHTML = Handlebars.templates.taskPopup(task);
    // todo вынести таску в отдельную модель

    this.popupContainer.classList.remove('menu-hidden');
    document.body.classList.add('root-while-popup');

    const buttonClose = document.getElementById('btn-close');
    buttonClose.addEventListener('click', () => this.closePopup());

    const buttonsTaskDelete = document.getElementById(`task-delete-${task.id}`);
    buttonsTaskDelete.addEventListener('click',
      () => this.eventBus.call(BoardPageEvent.clickDeleteTask, +buttonsTaskDelete.dataset.id));

    const buttonTaskUpdate = document.getElementById(`task-update-${task.id}`);
    buttonTaskUpdate.addEventListener('click',
      () => this.clickUpdateTask(task));
  }

  clickUpdateTask(task) {
    const taskName = document.getElementById(`task-name-${task.id}`).textContent;
    const taskDescription = document.getElementById(`task-description-${task.id}`).textContent;

    const newTaskName = taskName !== '' ? taskName : task.name;
    const newTaskDescription = taskDescription !== '' ? taskDescription : task.description;

    this.eventBus.call(BoardPageEvent.clickUpdateTask, {
      id: task.id,
      name: newTaskName,
      description: newTaskDescription,
    });
  }

  renderPopupBoard(board) {
    // eslint-disable-next-line no-undef
    this.popupContainer.innerHTML = Handlebars.templates.boardPopup(board);

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
      // eslint-disable-next-line no-undef
      Handlebars.templates.boardPage({ ...row, singleRow: true }),
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
   * @param {taskOuter} task
   * @param {number} rowPosition
   */
  renderNewTask(task, rowPosition) {
    const newDocumentFragmentTask = document.createRange().createContextualFragment(
      // eslint-disable-next-line no-undef
      Handlebars.templates.boardPage({ ...task, singleTask: true }),
    );
    document.getElementsByClassName('row-body')[rowPosition].append(newDocumentFragmentTask);
    const newHTMLElementTask = document.getElementById(`task-${task.id}`);
    newHTMLElementTask.onclick = () => this.eventBus.call(
      BoardPageEvent.openTask, +newHTMLElementTask.dataset.id,
    );
    this.buttonsTask.push(newHTMLElementTask);
    this.addDnDForTask(newHTMLElementTask);
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

  /**
   *
   * @param {Object} task
   * @param {number} task.id
   * @param {string} task.name
   */
  renderUpdateTask(task) {
    this.closePopup();
    document.getElementById(`task-${task.id}`).innerText = task.name;
  }
}
