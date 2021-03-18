const BACKEND_API_ADDRESS = 'http://89.208.199.114:1323/api';
// const BACKEND_API_ADDRESS = 'http://localhost:1323/api';

export const ApiRoutes = {
  login: '/login/',
  profile: '/users/',
  registration: '/users/',
  exit: '/logout/',
  uploadAvatar: '/upload/',
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
export const myProfilePatch = (profile) => patchJson(profile, ApiRoutes.profile);

/**
 * Запрос получения своего профиля на сервер
 * @return {Promise}
 */
export const myProfileGet = () => get(ApiRoutes.profile);

/**
 * Запрос изменения аватара
 * @param {File} file
 * @return {Promise}
 */
export const myProfileAvatarUpload = (file) => {
  const formData = new FormData();
  formData.append('file', file);

  return fetch(BACKEND_API_ADDRESS + ApiRoutes.uploadAvatar, {
    credentials: 'include',
    method: 'POST',
    body: formData,
  });
};
