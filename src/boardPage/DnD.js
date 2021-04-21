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
 * @param {HTMLElement[]} tasks
 * @param {point} taskCenter
 * @return {HTMLElement}
 */
const nearestTaskByY = (tasks, taskCenter) => findBest(
  tasks.map((otherTask) => ({ task: otherTask, ...delta(getCenter(otherTask), taskCenter) })),
  (a, b) => Math.abs(a.x) < Math.abs(b.x) || Math.abs(a.y) < Math.abs(b.y),
).task;

/**
 * @param {() => Element} getElement
 * @param {() => number} checker
 * @param {'vertical'|'horizontal'} direction
 * @param {() => number} move
 * @param {object} controller
 * @param {number} controller.id
 * @returns {()=>void}
 */
const customScrollRule = (
  getElement,
  direction,
  checker,
  move,
) => {
  let startTime;
  let id;
  const scroll = (time) => {
    const delTime = time - startTime;
    startTime = time;
    if (checker() > 0) {
      const args = [0, delTime * move()];
      getElement().scrollBy(...(direction === 'horizontal' ? args.reverse() : args));
    }
    id = requestAnimationFrame(scroll);
  };
  id = requestAnimationFrame(scroll);
  return () => cancelAnimationFrame(id);
};

const scrollEarlierLeft = 10;
const scrollEarlierRight = 10;
const scrollEarlierUp = 0;
const scrollEarlierDown = 0;

/**
 * @param {number} speed
 */
const speeder = (speed) => speed ** 0.5 / 10;

/**
 * @param {HTMLElement} task
 * @param {()=>Element} getNearestRow
 * @returns {(()=>void)[]}
 */
const addGlobalScroll = (task, getNearestRow) => {
  const toRight = () => scrollEarlierRight
    + task.getBoundingClientRect().right
    - document.body.offsetWidth;
  const toLeft = () => scrollEarlierLeft - task.getBoundingClientRect().left;
  const toDown = () => scrollEarlierDown
    + task.getBoundingClientRect().bottom
    - getNearestRow().offsetTop
    - getNearestRow().offsetHeight;
  const toUp = () => scrollEarlierUp + getNearestRow().offsetTop - task.getBoundingClientRect().top;
  return [
    customScrollRule(
      () => document.getElementById('rows-container'),
      'horizontal',
      toRight,
      () => speeder(toRight()),
    ),
    customScrollRule(
      () => document.getElementById('rows-container'),
      'horizontal',
      toLeft,
      () => -speeder(toLeft()),
    ),
    customScrollRule(
      getNearestRow,
      'vertical',
      toDown,
      () => speeder(toDown()),
    ),
    customScrollRule(
      getNearestRow,
      'vertical',
      toUp,
      () => -speeder(toUp()),
    ),
  ];
};

/**
 * @param {(()=>void)[]} globalController
 */
const deleteGlobalScroll = (globalController) => globalController
  .forEach((stopScroll) => stopScroll());

/**
 * @param {HTMLElement} param0
 * @param {number} shiftX
 * @param {number} shiftY
 * @returns {(pageX:number,pageY:number)=>void}
 */
const moveElementAtWithShift = ({ style }, shiftX, shiftY) => (pageX, pageY) => {
  style.left = `${pageX - shiftX}px`;
  style.top = `${pageY - shiftY}px`;
};

/**
 * @param {HTMLElement} task
 * @param {EventBus} eventBus
 * @returns {(onMouseDownEvent:MouseEvent) => void}
 */
const onMouseDown = (task, eventBus) => ({ offsetX: shiftX, offsetY: shiftY }) => {
  const ghostTask = createGhostTask(task);

  document.body.style.overflow = 'hidden';

  /**
   * @param {number} pageX
   * @param {number} pageY
   */
  const moveAt = moveElementAtWithShift(task, shiftX, shiftY);

  const allRows = [...document.getElementsByClassName('row-body')];

  let isMoveStarted = false;
  const bufOnclick = task.onclick;
  let globalController = null;

  /**
   * @param {MouseEvent} onMouseMoveEvent
   */
  const onMouseMove = ({ pageX, pageY }) => {
    moveAt(pageX, pageY);

    const correctCenterTask = getCenter(task);

    correctCenterTask.x += document.getElementById('rows-container').scrollLeft;
    const nearestRow = nearestRowByX(allRows, correctCenterTask);
    correctCenterTask.y += nearestRow.scrollTop;
    const nearestTask = nearestTaskByY([...nearestRow.getElementsByClassName('task'), ghostTask], correctCenterTask);

    nearestTask[correctCenterTask.y < getCenter(nearestTask).y ? 'after' : 'before'](ghostTask);

    if (!isMoveStarted) {
      task.after(ghostTask);
      fixHeight(task, task.offsetHeight - 20);
      fixWidth(task, task.offsetWidth - 20);
      task.classList.replace('task', 'task-dnd');
      task.onclick = null;
      globalController = addGlobalScroll(task, () => nearestRow);
    }
    isMoveStarted = true;
  };

  document.addEventListener('mousemove', onMouseMove);

  const deleteDnDForTask = () => {
    if (isMoveStarted) {
      deleteGlobalScroll(globalController);
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
      task.style = null;
      document.body.style.overflow = null;
      setTimeout(() => {
        task.onclick = bufOnclick;
      });
      replaceObjectPropForNSeconds(task.style, 'transition', 'none', {}, 0);
    }
    document.removeEventListener('mousemove', onMouseMove);
    window.removeEventListener('mouseup', deleteDnDForTask);
  };

  window.addEventListener('mouseup', deleteDnDForTask);
};

/**
  * @param {HTMLElement} task
  * @param {EventBus} eventBus
  */
export const addDnDForTask = (task, eventBus) => {
  task.onmousedown = onMouseDown(task, eventBus);
  task.addEventListener('dragstart', () => false);
};

export const addDnDForAllTasks = (eventBus) => {
  [...document.getElementsByClassName('task')].forEach((task) => addDnDForTask(task, eventBus));
};
