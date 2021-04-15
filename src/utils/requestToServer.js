const PORT = 1323;
// Don't change or move FIRST Line
const BACKEND_API_ADDRESS = `http://89.208.199.114:${PORT}/api`;
// const BACKEND_API_ADDRESS = `http://localhost:${PORT}/api`;

export const ApiRoutes = {
  login: '/login/',
  profile: '/users/',
  registration: '/users/',
  exit: '/logout/',
  uploadAvatar: '/upload/',
  authorized: '/authorized/',
  boards: '/boards/',
  rows: '/rows/',
  tasks: '/tasks/',
};

/**
 * Создает POST запрос с телом JSON
 * @param {object} data - становится телом в формате JSON
 * @param {string} route - путь запроса
 * @returns {Promise}
 */
const postJson = (data, route) => fetch(BACKEND_API_ADDRESS + route, {
  credentials: 'include',
  method: 'POST',
  body: JSON.stringify(data),
  headers: {
    'Content-Type': 'application/json',
  },
});

/**
 * Создает PATCH запрос с телом JSON
 * @param {object} data - становится телом в формате JSON
 * @param {string} route - путь запроса
 * @returns {Promise}
 */
const patchJson = (data, route) => fetch(BACKEND_API_ADDRESS + route, {
  credentials: 'include',
  method: 'PATCH',
  body: JSON.stringify(data),
  headers: {
    'Content-Type': 'application/json',
  },
});

/**
 * Создает DELETE запрос без тела
 * @param {string} route - путь запроса
 * @returns {Promise}
 */
const deleteEmpty = (route) => fetch(BACKEND_API_ADDRESS + route, {
  credentials: 'include',
  method: 'DELETE',
  headers: {
    'Content-Type': 'application/json',
  },
});

/**
 * Создает GET запрос без тела
 * @param {string} route - путь запроса
 * @returns {Promise}
 */
const get = (route) => fetch(BACKEND_API_ADDRESS + route, {
  credentials: 'include',
  method: 'GET',
  headers: {
    'Content-Type': 'application/json',
  },
});

/**
 * Запрос авторизации
 * @param {Object} profile
 * @param {string} profile.email
 * @param {string} profile.password
 * @return {Promise}
 */
export const login = (profile) => postJson(profile, ApiRoutes.login);

/**
 * Запрос регистрации
 * @param {Object} profile
 * @param {string} profile.email
 * @param {string} profile.username
 * @param {string} profile.password
 * @return {Promise}
 */
export const registration = (profile) => postJson(profile, ApiRoutes.registration);

/**
 * Запрос для выхода
 * @return {Promise}
 */
export const exit = () => deleteEmpty(ApiRoutes.exit);

/**
 * Запрос изменения профиля
 * @param {Object} profile
 * @param {string} profile.email
 * @param {string} profile.username
 * @param {string} profile.password
 * @return {Promise}
 */
export const profilePatch = (profile) => patchJson(profile, ApiRoutes.profile);

/**
 * Запрос получения своего профиля на сервер
 * @return {Promise}
 */
export const profileGet = () => get(ApiRoutes.profile);

/**
 * Запрос изменения аватара
 * @param {File} file
 * @return {Promise}
 */
export const profileAvatarUpload = (file) => {
  const formData = new FormData();
  formData.append('file', file);

  return fetch(BACKEND_API_ADDRESS + ApiRoutes.uploadAvatar, {
    credentials: 'include',
    method: 'POST',
    body: formData,
  });
};

/**
 * Запрос проверки авторизованности
 * @return  {Promise}
 */
export const isAuthorized = () => get(ApiRoutes.authorized);

/**
 * Запрос получения доски по id
 * @param  {number} id
 * @returns {Promise}
 */
export const boardGetById = (id) => get(`${ApiRoutes.boards + id}/`);

export const taskGetById = (id) => get(`${ApiRoutes.tasks + id}/`);

export const boardsGet = () => get(ApiRoutes.boards);

/**
 * @param {!string} name
 */
export const boardCreate = (name) => postJson({ name }, ApiRoutes.boards);

/**
 * @param {Object} rowInfo
 * @param {number} rowInfo.board_id
 * @param {string} rowInfo.name
 * @param {number} rowInfo.position
 */
export const rowCreate = (rowInfo) => postJson(rowInfo, ApiRoutes.rows);

/**
 * @param {Object} taskInfo
 * @param {number} taskInfo.row_id
 * @param {string} taskInfo.name
 * @param {number} taskInfo.position
 */
export const taskCreate = (taskInfo) => postJson(taskInfo, ApiRoutes.tasks);

/**
 * @param {number} rowId
 */
export const rowDelete = (rowId) => deleteEmpty(`${ApiRoutes.rows + rowId}/`);

/**
 * @param {number} taskId
 */
export const taskDelete = (taskId) => deleteEmpty(`${ApiRoutes.tasks + taskId}/`);

/**
 * @param {number} boardId
 */
export const boardDelete = (boardId) => deleteEmpty(`${ApiRoutes.boards + boardId}/`);

/**
 *
 * @param {number} rowId
 * @param {Object} patchInfo
 * @param {string} patchInfo.name
 * @param {Object} [patchInfo.carry_over] Перенос на другой столбец
 * @param {Object} [patchInfo.move] Перенос внутри столбца
 */
export const rowPatch = (rowId, patchInfo) => patchJson(patchInfo, `${ApiRoutes.rows + rowId}/`);
