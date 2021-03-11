// const BACKEND_API_ADDRESS = 'http://89.208.199.114:1323/api';
const BACKEND_API_ADDRESS = 'http://localhost:1323/api';

export const ApiRoutes = {
  loginForm: '/login/',
  login: '/login/',
  profileForm: '/users/',
  profile: '/profile',
  registration: '/users/',
  exit: '/logout/',
  uploadAvatar: '/upload/',
};

/**
 * Запрос на сервер авторизации
 * @param {Object} profile
 * @param {string} profile.email
 * @param {string} profile.password
 * @return {Promise}
 */
export const loginForm = (profile) => fetch(BACKEND_API_ADDRESS + ApiRoutes.loginForm, {
  credentials: 'include',
  method: 'POST',
  body: JSON.stringify(profile),
  headers: {
    'Content-Type': 'application/json',
  },
});

export const exitRequest = () => fetch(BACKEND_API_ADDRESS + ApiRoutes.exit, {
  method: 'DELETE',
  headers: {
    'Content-Type': 'application/json',
  },
  credentials: 'include',
});

/**
 * Запрос на сервер изменения профиля
 * @param {string} id
 * @param {Object} profile
 * @param {string} profile.username
 * @param {string} profile.password
 * @return {Promise}
 */
export const profilePatchForm = (profile) => fetch(
  BACKEND_API_ADDRESS + ApiRoutes.profileForm, {
    method: 'PATCH',
    body: JSON.stringify(profile),
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
  },
);

/**
 * Запрос на сервер изменения аватара
 * @param {File} file
 * @return {Promise}
 */
export const profileAvatarUpload = (file) => {
  const formData = new FormData();
  formData.append('file', file);
  return fetch(BACKEND_API_ADDRESS + ApiRoutes.uploadAvatar, {
    method: 'POST',
    body: formData,
    credentials: 'include',
  });
};

/**
 * Запрос на сервер получения профиля
 * @param {string} id
 * @return {Promise}
 */
export const profileGetForm = () => fetch(BACKEND_API_ADDRESS + ApiRoutes.profileForm, {
  method: 'GET',
  headers: {
    'Content-Type': 'application/json',
  },
  credentials: 'include',
});

export const waitAnsFromServer = (prom, callError, callSuccess) => {
  let timer;
  prom
    .then(callSuccess)
    .catch((err) => callError(err.error))
    .finally(() => clearTimeout(timer));
  timer = setTimeout(() => callError('Превышенно время ожидания сервера'), 5 * 1000);
};

/**
 * Запрос на сервер регистрации
 * @param {Object} profile
 * @param {string} profile.email
 * @param {string} profile.username
 * @param {string} profile.password
 * @return {Promise}
 */
export const registrationForm = (profile) => fetch(
  BACKEND_API_ADDRESS + ApiRoutes.registration, {
    credentials: 'include',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(profile),
  },
);
