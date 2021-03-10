const BACKEND_ADDRESS = 'http://89.208.199.114:1323/api';

export const ApiRoutes = {
  loginForm: '/login/',
  login: '/login',
  profileForm: '/users',
  profile: '/profile',
  registration: '/users/',
  exit: '/logout/',
};

/**
 * Запрос на сервер авторизации
 * @param {Object} profile
 * @param {string} profile.username
 * @param {string} profile.password
 * @return {Promise}
 */
export const loginForm = async (profile) => fetch(BACKEND_ADDRESS + ApiRoutes.loginForm, {
  credentials: 'include',
  method: 'POST',
  body: JSON.stringify(profile),
  headers: {
    'Content-Type': 'application/json',
  },
}).then((req) => req.json());

export const exitRequest = async () => fetch(BACKEND_ADDRESS + ApiRoutes.exit, {
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
export const profilePatchForm = async (profile) => fetch(`${BACKEND_ADDRESS}${ApiRoutes.profileForm}/`, {
  method: 'PATCH',
  body: JSON.stringify(profile),
  headers: {
    'Content-Type': 'application/json',
  },
  credentials: 'include',
});

/**
 * Запрос на сервер получения профиля
 * @param {string} id
 * @return {Promise}
 */
export const profileGetForm = async () => fetch(`${BACKEND_ADDRESS}${ApiRoutes.profileForm}/`, {
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
export const registrationForm = async (profile) => fetch(BACKEND_ADDRESS + ApiRoutes.registration, {
  credentials: 'include',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify(profile),
});
