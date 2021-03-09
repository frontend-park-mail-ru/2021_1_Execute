const BACKEND_ADDRESS = 'http://localhost:8080/api';

export const ApiRoutes = {
  loginForm: '/loginform',
  login: '/login',
  registration: '/users',
};

/**
 * Запрос на сервер авторизации
 * @param {Object} profile
 * @param {string} profile.username
 * @param {string} profile.password
 * @return {Promise}
 */
export const loginForm = async (profile) => fetch(ApiRoutes.loginForm, {
  method: 'POST',
  body: JSON.stringify(profile),
  headers: {
    'Content-Type': 'application/json',
  },
}).then((req) => req.json())
  .then((req) => {
    if (req.error) {
      throw new Error(req.error);
    }
  });

/**
 * Запрос на сервер регистрации
 * @param {Object} profile
 * @param {string} profile.email
 * @param {string} profile.username
 * @param {string} profile.password
 * @return {Promise}
 */
export const registrationForm = async (profile) => {
  fetch(new URL(ApiRoutes.registration, BACKEND_ADDRESS), {
    method: 'POST',
    body: JSON.stringify(profile),
    headers: {
      'Content-Type': 'application/json',
    },
  }).then((req) => req.json());
};
