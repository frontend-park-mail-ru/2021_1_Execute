const PORT = 1323;
// Don't change or move FIRST Line
// const BACKEND_API_ADDRESS = `http://89.208.199.114:${PORT}/api`;
const BACKEND_API_ADDRESS = `http://localhost:${PORT}/api`;

export const ApiRoutes = {
  login: '/login/',
  profile: '/users/',
  registration: '/users/',
  exit: '/logout/',
  uploadAvatar: '/upload/',
  authorized: '/authorized/',
  getArrayBoards: '/api/boards/',
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
 * @param {!string} name
 */
// export const boardCreate = () => postJson(name, ApiRoutes.getArrayBoards);
export const boardCreate = () => Promise.resolve({
  status: 200,
  json: () => ({
    id: 666,
  }),
});

// export const boardsGet = () => get(ApiRoutes.getArrayBoards);
export const boardsGet = () => Promise.resolve({
  status: 200,
  json: () => ({
    boards: [
      {
        id: 5,
        access: 'Guest',
        isStared: false,
        name: 'dedeed',
        description: 'hdhhdhdhwjhwd',
      },
      {
        id: 6,
        access: 'Guest',
        isStared: false,
        name: 'deldelk',
        description: 'dliekkldele',
      },
      {
        id: 7,
        access: 'Guest',
        isStared: false,
        image: '/32.jpg', // ?? для примера, что уже есть фон у карточек
        name: 'cdmc,mc,',
        description: 'dkleldkelde',
      },
      {
        id: 20,
        access: 'Guest',
        isStared: false,
        name: '',
        description: '',
      },
      {
        id: 21,
        access: 'Guest',
        isStared: false,
        name: '',
        description: '',
      },
      {
        id: 22,
        access: 'Guest',
        isStared: false,
        name: '',
        description: '',
      },
      {
        id: 8,
        access: 'Guest',
        isStared: false,
        image: '/fon1.jpg',
        name: 'dedemed',
        description: 'dejhjdehjedhe',
      },
      {
        id: 0,
        access: 'Admin',
        isStared: false,
        name: '0',
        description: 'Если ты видишь этот текст до конца, то это больша проблема, так как я не нашел нормального решения (не через какие-то древние костыли) как сделать обрезания многострочного текста',
      },
      {
        id: 1,
        access: 'Admin',
        isStared: false,
        image: '/35.jpg',
        name: '1',
      },
      {
        id: 26,
        access: 'Admin',
        isStared: false,
        name: '',
        description: '',
      },
      {
        id: 27,
        access: 'Admin',
        isStared: false,
        name: '',
        description: '',
      },
      {
        id: 28,
        access: 'Admin',
        isStared: false,
        name: '',
        description: '',
      },
      {
        id: 29,
        access: 'Admin',
        isStared: false,
        name: '',
        description: '',
      },
      {
        id: 3,
        access: 'Admin',
        isStared: false,
        image: '/white.png',
        name: '3',
        description: 'Тест тупо белого фона',
      },
    ],
  }),
});
