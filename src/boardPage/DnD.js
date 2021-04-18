import { replaceObjectPropForNSeconds } from '../utils/temporaryReplacement.js';
import { BoardPageEvent } from './boardPageEvents.js';

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
 * @typedef {object} point
 * @property {number} x
 * @property {number} y
 */

/**
 * @param {HTMLElement} task
 * @return {point}
 */
const getCenter = (task) => ({
  x: task.offsetLeft + task.offsetWidth / 2,
  y: task.offsetTop + task.offsetHeight / 2,
});

/**
 * @param {point} param0
 * @param {point} param1
 * @returns {point}
 */
const delta = ({ x: x1, y: y1 }, { x: x2, y: y2 }) => ({ x: (x1 - x2), y: (y1 - y2) });

/**
 * @param {any[]} arr
 * @param {(a,b) => boolean} comp "comp" equal "first elem is better"
 */
const findBest = (arr, comp) => arr.reduce((accum, elem) => (comp(accum, elem) ? accum : elem));

/**
 * @param {HTMLElement[]} rows
 * @param {point} taskCenter
 * @return {HTMLElement}
 */
const nearestRowByX = (rows, taskCenter) => findBest(
  rows.map((row) => ({ row, ...delta(getCenter(row), taskCenter) })),
  (a, b) => Math.abs(a.x) < Math.abs(b.x),
).row;

/**
 * @param {HTMLElement[]} rows
 * @param {point} taskCenter
 * @return {HTMLElement}
 */
const nearestTaskByY = (tasks, taskCenter) => findBest(
  tasks.map((otherTask) => ({ task: otherTask, ...delta(getCenter(otherTask), taskCenter) })),
  (a, b) => Math.abs(a.y) < Math.abs(b.y),
).task;

/**
 * @param {Element} element
 * @param {() => boolean} checker
 * @param {object} param1
 * @param {?((time:number) => number)} param1.moveX
 * @param {?((time:number) => number)} param1.moveY
 * @param {object} controller
 * @param {number} controller.id
 * @returns {boolean}
 */
const customScrollRule = (
  element, checker = () => true, { moveX = () => 0, moveY = () => 0 }, controller,
) => {
  let startTime = NaN;
  const scroll = (time) => {
    const delTime = time - startTime;
    startTime = time;
    if (checker()) {
      element.scrollBy(delTime * moveX(), delTime * moveY());
    }
    controller.id = requestAnimationFrame(scroll);
  };
  controller.id = requestAnimationFrame(scroll);
};

const scrollEarlierLeft = 10;
const scrollEarlierRight = 10;
const scrollEarlierUp = 0;
const scrollEarlierDown = 0;

/**
 * @param {number} speed
 */
const speeder = (speed) => speed ** 0.5;

/**
 * @param {HTMLElement} task
 * @param {EventBus} eventBus
 * @returns {(onMouseDownEvent:MouseEvent) => void}
 */
const onMouseDown = (task, eventBus) => (onMouseDownEvent) => {
  const shiftX = onMouseDownEvent.offsetX;
  const shiftY = onMouseDownEvent.offsetY;

  const ghostTask = createGhostTask(task);

  document.body.style.overflow = 'hidden';

  /**
   * @param {number} pageX
   * @param {number} pageY
   */
  const moveAt = (pageX, pageY) => {
    task.style.left = `${pageX - shiftX}px`;
    task.style.top = `${pageY - shiftY}px`;
  };

  const allRows = [...document.getElementsByClassName('row-body')];
  let nearestRow = allRows[0];

  let withoutMouseMove = true;
  const bufOnclick = task.onclick;
  const controller = {
    toLeft: {}, toRight: {}, toUp: {}, toDown: {},
  };

  const firstOnMouseMove = () => {
    task.after(ghostTask);
    fixHeight(task, task.offsetHeight - 20);
    fixWidth(task, task.offsetWidth - 20);
    task.classList.replace('task', 'task-dnd');
    task.onclick = null;

    const toRight = () => scrollEarlierRight + task.getBoundingClientRect().right
      - document.body.offsetWidth;
    customScrollRule(
      document.getElementById('rows-container'),
      () => toRight() > 0,
      { moveX: () => speeder(toRight()) },
      controller.toRight,
    );
    const toLeft = () => scrollEarlierLeft - task.getBoundingClientRect().left;
    customScrollRule(
      document.getElementById('rows-container'),
      () => toLeft() > 0,
      { moveX: () => -speeder(toLeft()) },
      controller.toLeft,
    );

    const toDown = () => scrollEarlierDown + task.getBoundingClientRect().bottom
      - nearestRow.offsetTop - nearestRow.offsetHeight;
    customScrollRule(
      nearestRow,
      () => toDown() > 0,
      { moveY: () => speeder(toDown()) },
      controller.toDown,
    );
    const toUp = () => scrollEarlierUp + nearestRow.offsetTop - task.getBoundingClientRect().top;
    customScrollRule(
      nearestRow,
      () => toUp() > 0,
      { moveY: () => -speeder(toUp()) },
      controller.toUp,
    );
  };

  /**
   * @param {MouseEvent} onMouseMoveEvent
   */
  const onMouseMove = (onMouseMoveEvent) => {
    if (withoutMouseMove) {
      firstOnMouseMove();
    }
    withoutMouseMove = false;

    moveAt(onMouseMoveEvent.pageX, onMouseMoveEvent.pageY);
    const correctCenterTask = getCenter(task);

    correctCenterTask.x += document.getElementById('rows-container').scrollLeft;
    nearestRow = nearestRowByX(allRows, correctCenterTask);
    correctCenterTask.y += nearestRow.scrollTop;
    const nearestTask = nearestTaskByY([...nearestRow.getElementsByClassName('task')], correctCenterTask);

    nearestTask.after(ghostTask);
  };

  document.addEventListener('mousemove', onMouseMove);

  const exit = () => {
    if (!withoutMouseMove) {
      cancelAnimationFrame(controller.toLeft);
      cancelAnimationFrame(controller.toRight);
      cancelAnimationFrame(controller.toUp);
      cancelAnimationFrame(controller.toDown);
      task.classList.replace('task-dnd', 'task');
      ghostTask.after(task);
      ghostTask.remove();
      const newRowId = +task.parentNode.dataset.id;
      const newPosition = [...task.parentElement.children].indexOf(task) - 1;
      eventBus.call(BoardPageEvent.moveTask, {
        taskId: +task.dataset.id,
        newRowId,
        newPosition,
      });
      task.style = '';
      document.body.style.overflow = '';
      setTimeout(() => {
        task.onclick = bufOnclick;
      }, 0);
      replaceObjectPropForNSeconds(task.style, 'transition', 'none', {}, 0);
    }
    document.removeEventListener('mousemove', onMouseMove);
    window.removeEventListener('mouseup', exit);
  };

  window.addEventListener('mouseup', exit);
};

/**
  * @param {HTMLElement} task
  */
export const addDnDForTask = (task, eventBus) => {
  task.onmousedown = onMouseDown(task, eventBus);
  task.addEventListener('dragstart', () => false);
};

export const addDnDForAllTasks = (eventBus) => {
  [...document.getElementsByClassName('task')].forEach((task) => addDnDForTask(task, eventBus));
};
