export const ConstantEventsString = {
  root: '/',
  login: '/login',
  registration: '/registration',
  profile: '/profile',
  main: '/main',
};

export const ConstantEventsRegExp = {
  root: /^\/?$/,
  login: /^\/?login\/?$/,
  registration: /^\/?registration\/?$/,
  profile: /^\/?profile\/?$/,
  board: /^\/?board\/(?<boardId>\d+)\/?$/,
  task: /^\/?board\/(?<boardId>\d+)\/task\/(?<taskId>\d+)\/?$/,
  main: /^\/?main\/?$/,
};

/**
 * @param {number} boardId
 * @param {number} taskId
 * @returns {string} /board/${boardId}/task/${taskId}
 */
export const getTaskRoute = (boardId, taskId) => `/board/${boardId}/task/${taskId}`;

/**
 * @param {number} boardId
 * @returns {string} /board/${boardId}
 */
export const getBoardRoute = (boardId) => `/board/${boardId}`;
