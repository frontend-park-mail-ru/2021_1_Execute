export const ApiRoutes = {
  loginForm: '/loginform',
  login: '/login',
  profileForm: '/profileform',
  profile: '/profile',
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
    return req;
  });

/**
 * Запрос на сервер изменения профиля
 * @param {Object} profile
 * @param {string} profile.username
 * @param {string} profile.password
 * @return {Promise}
 */
export const profileForm = async (profile) => fetch(ApiRoutes.profileForm, {
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
    return req;
  });
