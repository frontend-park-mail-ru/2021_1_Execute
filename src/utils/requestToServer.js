const BACKEND_ADDRESS = 'http://localhost:1323/api';

export const ApiRoutes = {
  loginForm: '/login',
  login: '/login',
  profileForm: '/users',
  profile: '/profile',
  registration: '/users',
};

/**
 * Запрос на сервер авторизации
 * @param {Object} profile
 * @param {string} profile.username
 * @param {string} profile.password
 * @return {Promise}
 */
export const loginForm = async (profile) => fetch(BACKEND_ADDRESS + ApiRoutes.loginForm, {
  method: 'POST',
  body: JSON.stringify(profile),
  headers: {
    'Content-Type': 'application/json',
  },
}).then((req) => req.json());

/**
 * Запрос на сервер изменения профиля
 * @param {string} id
 * @param {Object} profile
 * @param {string} profile.username
 * @param {string} profile.password
 * @return {Promise}
 */
export const profilePatchForm = async (id, profile) => fetch(BACKEND_ADDRESS + `${ApiRoutes.profileForm}/${id}`, {
  method: 'POST',
  body: JSON.stringify(profile),
  headers: {
    'Content-Type': 'application/json',
  },
}).then((req) => req.json());

/**
 * Запрос на сервер получения профиля
 * @param {string} id
 * @return {Promise}
 */
export const profileGetForm = async (id) => fetch(BACKEND_ADDRESS + `${ApiRoutes.profileForm}/${id}`, {
  method: 'GET',
  headers: {
    'Content-Type': 'application/json',
  },
}).then((req) => req.json());

export const waitAnsFromServer = (prom, callError, callSuccess) => {
  let timer;
  prom
    .then(callSuccess)
    .catch((err) => callError(err.error))
    .finally(() => clearTimeout(timer));
  timer = setTimeout(() => callError('Превышенно время ожидания сервера'), 5 * 1000);
};

export const getCookie = (name) => {
  const matches = document.cookie.match(new RegExp(
    // eslint-disable-next-line no-useless-escape
    `(?:^|; )${name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1')}=([^;]*)`,
  ));
  return matches ? decodeURIComponent(matches[1]) : undefined;
};

export const setCookie = (name, value, inputOptions = {}) => {
  const options = {
    path: '/',
    // при необходимости добавьте другие значения по умолчанию
    ...inputOptions,
  };

  if (options.expires instanceof Date) {
    options.expires = options.expires.toUTCString();
  }

  let updatedCookie = `${encodeURIComponent(name)}=${encodeURIComponent(value)}`;

  Object.keys(options).forEach((optionKey) => {
    updatedCookie += `; ${optionKey}`;
    const optionValue = options[optionKey];
    if (optionValue !== true) {
      updatedCookie += `=${optionValue}`;
    }
  });

  document.cookie = updatedCookie;
};

/**
 * Запрос на сервер регистрации
 * @param {Object} profile
 * @param {string} profile.email
 * @param {string} profile.username
 * @param {string} profile.password
 * @return {Promise}
 */
 export const registrationForm = async (profile) => {
  return fetch(BACKEND_ADDRESS + ApiRoutes.registration, {
    credentials: 'include',
    method: 'POST',
    body: JSON.stringify(profile),
    headers: {
      'Content-Type': 'application/json',
    },
  });
};
