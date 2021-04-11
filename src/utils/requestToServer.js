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
  getBoards: '/api/boards/',
  getTasks: '/api/tasks/',
  postBoards: '/api/boards/',
  postRows: '/api/rows/',
  postTasks: '/api/tasks/',
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
// export const boardGetById = (id) => get(`${ApiRoutes.getBoards + id}/`);
export const boardGetById = (id) => (id !== 5
  ? Promise.resolve({ status: 404 })
  : Promise.resolve({
    status: 200,
    json: () => Promise.resolve({
      board: {
        id,
        isStared: true,
        name: 'asdasdasnamename',
        description: 'opisanielolopposumlorem',
        users: {
          owners: {
            id: 1,
            avatar: '../../img/32.jpg',
          },
          admins: [],
          members: [{
            id: 1,
            avatar: '../../img/32.jpg',
          }, {
            id: 1,
            avatar: '../../img/32.jpg',
          },
          {
            id: 1,
            avatar: '../../img/32.jpg',
          }, {
            id: 1,
            avatar: '../../img/32.jpg',
          }],
        },
        rows: {
          0: {
            id: 0,
            position: 0,
            name: 'Помимо редактор дремать.',
            tasks: {
              0: {
                id: 0,
                position: 0,
                name: 'Зима дружно.',
              },
              1: {
                id: 1,
                position: 1,
                name: 'Приятель торопливый металл.',
              },
              2: {
                id: 2,
                position: 2,
                name: 'Свежий юный.',
              },
              3: {
                id: 3,
                position: 3,
                name: 'Теория.',
              },
              4: {
                id: 4,
                position: 4,
                name: 'Четыре призыв.',
              },
              5: {
                id: 5,
                position: 5,
                name: 'Бетонный кузнец.',
              },
              6: {
                id: 6,
                position: 6,
                name: 'Солнце рота.',
              },
              7: {
                id: 7,
                position: 7,
                name: 'Выкинуть еврейский.',
              },
              8: {
                id: 8,
                position: 8,
                name: 'Ягода.',
              },
              9: {
                id: 9,
                position: 9,
                name: 'Господь скрытый бабочка выразить.',
              },
              10: {
                id: 10,
                position: 10,
                name: 'Услать о мелочь.',
              },
              11: {
                id: 11,
                position: 11,
                name: 'Грудь.',
              },
              12: {
                id: 12,
                position: 12,
                name: 'Тяжелый стакан строительство.',
              },
              13: {
                id: 13,
                position: 13,
                name: 'Приличный манера правильный.',
              },
              14: {
                id: 14,
                position: 14,
                name: 'Степь песня.',
              },
              15: {
                id: 15,
                position: 15,
                name: 'Кожа промолчать.',
              },
            },
          },
          1: {
            id: 1,
            position: 1,
            name: 'Интеллектуальный художественный блин сходить.',
            tasks: {
              0: {
                id: 16,
                position: 0,
                name: 'Монета серьезный.',
              },
              1: {
                id: 17,
                position: 1,
                name: 'Июнь актриса медицина мотоцикл.',
              },
              2: {
                id: 18,
                position: 2,
                name: 'Народ теория.',
              },
              3: {
                id: 19,
                position: 3,
                name: 'Пастух секунда.',
              },
              4: {
                id: 20,
                position: 4,
                name: 'Изредка горький набор.',
              },
            },
          },
          2: {
            id: 2,
            position: 2,
            name: 'Мучительно.',
            tasks: {
              0: {
                id: 21,
                position: 0,
                name: 'Жестокий умолять.',
              },
              1: {
                id: 22,
                position: 1,
                name: 'Уронить горький.',
              },
              2: {
                id: 23,
                position: 2,
                name: 'Грустный головка.',
              },
              3: {
                id: 24,
                position: 3,
                name: 'Миф лиловый крыса.',
              },
              4: {
                id: 25,
                position: 4,
                name: 'Дыхание светило добиться.',
              },
              5: {
                id: 26,
                position: 5,
                name: 'Отметить о еврейский.',
              },
              6: {
                id: 27,
                position: 6,
                name: 'Военный июнь бегать.',
              },
              7: {
                id: 28,
                position: 7,
                name: 'Направо легко.',
              },
              8: {
                id: 29,
                position: 8,
                name: 'Юный виднеться естественный.',
              },
              9: {
                id: 30,
                position: 9,
                name: 'Ручей умолять космос.',
              },
              10: {
                id: 31,
                position: 10,
                name: 'Прежний угроза.',
              },
              11: {
                id: 32,
                position: 11,
                name: 'Горький очутиться засунуть.',
              },
              12: {
                id: 33,
                position: 12,
                name: 'Эпоха конструкция солнце.',
              },
              13: {
                id: 34,
                position: 13,
                name: 'Растеряться головка.',
              },
              14: {
                id: 35,
                position: 14,
                name: 'Кидать.',
              },
              15: {
                id: 36,
                position: 15,
                name: 'Реклама эпоха.',
              },
            },
          },
          3: {
            id: 3,
            position: 3,
            name: 'Заявление очередной.',
            tasks: {
              0: {
                id: 37,
                position: 0,
                name: 'Сустав покинуть.',
              },
              1: {
                id: 38,
                position: 1,
                name: 'Означать.',
              },
              2: {
                id: 39,
                position: 2,
                name: 'Прелесть сынок ярко.',
              },
            },
          },
          4: {
            id: 4,
            position: 4,
            name: 'Наткнуться упорно.',
            tasks: {
              0: {
                id: 40,
                position: 0,
                name: 'Самостоятельно понятный.',
              },
              1: {
                id: 41,
                position: 1,
                name: 'Дошлый выраженный помолчать рай.',
              },
            },
          },
          5: {
            id: 5,
            position: 5,
            name: 'Тысяча освободить.',
            tasks: {
              0: {
                id: 42,
                position: 0,
                name: 'Возбуждение жидкий.',
              },
            },
          },
          6: {
            id: 6,
            position: 6,
            name: 'Анализ инфекция вряд.',
            tasks: {
              0: {
                id: 43,
                position: 0,
                name: 'Жестокий пересечь витрина.',
              },
              1: {
                id: 44,
                position: 1,
                name: 'Товар настать мелькнуть.',
              },
              2: {
                id: 45,
                position: 2,
                name: 'Чем отдел.',
              },
              3: {
                id: 46,
                position: 3,
                name: 'Неправда райком дремать.',
              },
              4: {
                id: 47,
                position: 4,
                name: 'Бетонный юный.',
              },
              5: {
                id: 48,
                position: 5,
                name: 'Достоинство сутки указанный валюта.',
              },
            },
          },
          7: {
            id: 7,
            position: 7,
            name: 'Совет госпожа.',
            tasks: {
              0: {
                id: 49,
                position: 0,
                name: 'Миг передо плавно труп.',
              },
              1: {
                id: 50,
                position: 1,
                name: 'Цвет потом.',
              },
              2: {
                id: 51,
                position: 2,
                name: 'Необычный чем.',
              },
              3: {
                id: 52,
                position: 3,
                name: 'Бригада провинция возникновение.',
              },
              4: {
                id: 53,
                position: 4,
                name: 'Пол бабочка.',
              },
            },
          },
          8: {
            id: 8,
            position: 8,
            name: 'Ремень левый.',
            tasks: {
              0: {
                id: 54,
                position: 0,
                name: 'Применяться умирать постоянный.',
              },
              1: {
                id: 55,
                position: 1,
                name: 'Недостаток зачем возмутиться.',
              },
              2: {
                id: 56,
                position: 2,
                name: 'Триста.',
              },
              3: {
                id: 57,
                position: 3,
                name: 'Тревога применяться приятель.',
              },
              4: {
                id: 58,
                position: 4,
                name: 'Лиловый.',
              },
              5: {
                id: 59,
                position: 5,
                name: 'Сынок.',
              },
              6: {
                id: 60,
                position: 6,
                name: 'Приличный совещание уронить.',
              },
              7: {
                id: 61,
                position: 7,
                name: 'Упорно анализ левый.',
              },
              8: {
                id: 62,
                position: 8,
                name: 'Приличный труп.',
              },
              9: {
                id: 63,
                position: 9,
                name: 'Термин увеличиваться кожа.',
              },
              10: {
                id: 64,
                position: 10,
                name: 'Передо плясать монета.',
              },
              11: {
                id: 65,
                position: 11,
                name: 'Очко мусор.',
              },
              12: {
                id: 66,
                position: 12,
                name: 'Сходить советовать.',
              },
              13: {
                id: 67,
                position: 13,
                name: 'Ответить ход правильный.',
              },
              14: {
                id: 68,
                position: 14,
                name: 'Угроза бровь руководитель.',
              },
              15: {
                id: 69,
                position: 15,
                name: 'Правый армейский висеть.',
              },
              16: {
                id: 70,
                position: 16,
                name: 'Нервно парень плод.',
              },
              17: {
                id: 71,
                position: 17,
                name: 'Спасть снимать сбросить.',
              },
            },
          },
          9: {
            id: 9,
            position: 9,
            name: 'Прежде.',
            tasks: {
              0: {
                id: 72,
                position: 0,
                name: 'Солнце доставать коммунизм.',
              },
              1: {
                id: 73,
                position: 1,
                name: 'Граница аж монета табак.',
              },
              2: {
                id: 74,
                position: 2,
                name: 'Бетонный расстегнуть вариант.',
              },
              3: {
                id: 75,
                position: 3,
                name: 'Низкий опасность.',
              },
              4: {
                id: 76,
                position: 4,
                name: 'Запеть вчера возможно спешить.',
              },
              5: {
                id: 77,
                position: 5,
                name: 'Кузнец еврейский возникновение.',
              },
              6: {
                id: 78,
                position: 6,
                name: 'Задержать трубка.',
              },
              7: {
                id: 79,
                position: 7,
                name: 'Ягода тревога число помимо.',
              },
              8: {
                id: 80,
                position: 8,
                name: 'Рабочий еврейский.',
              },
              9: {
                id: 81,
                position: 9,
                name: 'Лиловый князь услать.',
              },
              10: {
                id: 82,
                position: 10,
                name: 'Еврейский возмутиться набор.',
              },
              11: {
                id: 83,
                position: 11,
                name: 'Следовательно приятель неожиданно.',
              },
              12: {
                id: 84,
                position: 12,
                name: 'Секунда зарплата.',
              },
              13: {
                id: 85,
                position: 13,
                name: 'Передо эпоха трясти развернуться.',
              },
            },
          },
          10: {
            id: 10,
            position: 10,
            name: 'Роскошный мимо.',
            tasks: {
              0: {
                id: 86,
                position: 0,
                name: 'Вряд вывести.',
              },
            },
          },
          11: {
            id: 11,
            position: 11,
            name: 'Находить дорогой.',
            tasks: {
              0: {
                id: 87,
                position: 0,
                name: 'Штаб валюта.',
              },
              1: {
                id: 88,
                position: 1,
                name: 'Падать.',
              },
              2: {
                id: 89,
                position: 2,
                name: 'Разводить терапия изменение отражение.',
              },
              3: {
                id: 90,
                position: 3,
                name: 'Передо костер вообще.',
              },
              4: {
                id: 91,
                position: 4,
                name: 'Сынок лететь.',
              },
              5: {
                id: 92,
                position: 5,
                name: 'Тысяча рай заплакать.',
              },
              6: {
                id: 93,
                position: 6,
                name: 'Смелый обида.',
              },
              7: {
                id: 94,
                position: 7,
                name: 'Деловой славный уничтожение.',
              },
              8: {
                id: 95,
                position: 8,
                name: 'Нервно ложиться настать.',
              },
              9: {
                id: 96,
                position: 9,
                name: 'Командование применяться.',
              },
            },
          },
          12: {
            id: 12,
            position: 12,
            name: 'Совет приходить изучить.',
            tasks: {
              0: {
                id: 97,
                position: 0,
                name: 'Заработать факультет.',
              },
              1: {
                id: 98,
                position: 1,
                name: 'Мера социалистический неправда.',
              },
              2: {
                id: 99,
                position: 2,
                name: 'Вывести предоставить исполнять.',
              },
              3: {
                id: 100,
                position: 3,
                name: 'Труп.',
              },
              4: {
                id: 101,
                position: 4,
                name: 'Монета сохранять командующий.',
              },
              5: {
                id: 102,
                position: 5,
                name: 'Костер иной ремень.',
              },
            },
          },
          13: {
            id: 13,
            position: 13,
            name: 'Порт миф.',
            tasks: {
              0: {
                id: 103,
                position: 0,
                name: 'Пропадать тесно лететь.',
              },
              1: {
                id: 104,
                position: 1,
                name: 'Девка при.',
              },
              2: {
                id: 105,
                position: 2,
                name: 'Помимо падать миф.',
              },
              3: {
                id: 106,
                position: 3,
                name: 'Рабочий угодный.',
              },
              4: {
                id: 107,
                position: 4,
                name: 'Перебивать конструкция.',
              },
              5: {
                id: 108,
                position: 5,
                name: 'Постоянный намерение.',
              },
              6: {
                id: 109,
                position: 6,
                name: 'Угроза растеряться тревога.',
              },
              7: {
                id: 110,
                position: 7,
                name: 'Правильный багровый некоторый.',
              },
              8: {
                id: 111,
                position: 8,
                name: 'Встать выкинуть.',
              },
              9: {
                id: 112,
                position: 9,
                name: 'Поставить монета выраженный.',
              },
              10: {
                id: 113,
                position: 10,
                name: 'Палец отъезд.',
              },
              11: {
                id: 114,
                position: 11,
                name: 'Изучить мальчишка.',
              },
              12: {
                id: 115,
                position: 12,
                name: 'Около ботинок.',
              },
              13: {
                id: 116,
                position: 13,
                name: 'Иной термин бок.',
              },
              14: {
                id: 117,
                position: 14,
                name: 'Опасность.',
              },
            },
          },
          14: {
            id: 14,
            position: 14,
            name: 'Опасность порядок терапия.',
            tasks: {
              0: {
                id: 118,
                position: 0,
                name: 'Дошлый командование.',
              },
              1: {
                id: 119,
                position: 1,
                name: 'Слишком жидкий наступать скрытый.',
              },
              2: {
                id: 120,
                position: 2,
                name: 'Художественный скрытый сходить.',
              },
              3: {
                id: 121,
                position: 3,
                name: 'Число сомнительный.',
              },
              4: {
                id: 122,
                position: 4,
                name: 'Забирать ягода обида вчера.',
              },
              5: {
                id: 123,
                position: 5,
                name: 'Чувство господь необычный слать.',
              },
              6: {
                id: 124,
                position: 6,
                name: 'Возможно задрать школьный.',
              },
              7: {
                id: 125,
                position: 7,
                name: 'Торопливый хотеть.',
              },
              8: {
                id: 126,
                position: 8,
                name: 'Рот подробность затянуться.',
              },
              9: {
                id: 127,
                position: 9,
                name: 'Танцевать солнце художественный.',
              },
              10: {
                id: 128,
                position: 10,
                name: 'Необычный засунуть.',
              },
            },
          },
          15: {
            id: 15,
            position: 15,
            name: 'Левый заявление.',
            tasks: {
              0: {
                id: 129,
                position: 0,
                name: 'Сравнение грустный.',
              },
              1: {
                id: 130,
                position: 1,
                name: 'За природа.',
              },
              2: {
                id: 131,
                position: 2,
                name: 'Интеллектуальный поезд интернет.',
              },
              3: {
                id: 132,
                position: 3,
                name: 'Зарплата собеседник.',
              },
              4: {
                id: 133,
                position: 4,
                name: 'Цепочка роса.',
              },
              5: {
                id: 134,
                position: 5,
                name: 'Космос салон.',
              },
              6: {
                id: 135,
                position: 6,
                name: 'Коллектив издали правый.',
              },
              7: {
                id: 136,
                position: 7,
                name: 'Пол июнь.',
              },
              8: {
                id: 137,
                position: 8,
                name: 'Научить мелочь.',
              },
              9: {
                id: 138,
                position: 9,
                name: 'Еврейский одиннадцать адвокат магазин.',
              },
              10: {
                id: 139,
                position: 10,
                name: 'Кольцо сутки.',
              },
            },
          },
          16: {
            id: 16,
            position: 16,
            name: 'Тута при.',
            tasks: {
              0: {
                id: 140,
                position: 0,
                name: 'Полоска академик.',
              },
              1: {
                id: 141,
                position: 1,
                name: 'Жидкий советовать.',
              },
              2: {
                id: 142,
                position: 2,
                name: 'Бок правый песня.',
              },
              3: {
                id: 143,
                position: 3,
                name: 'Призыв изредка выражаться.',
              },
              4: {
                id: 144,
                position: 4,
                name: 'Деловой команда смертельный.',
              },
              5: {
                id: 145,
                position: 5,
                name: 'Горький поставить.',
              },
              6: {
                id: 146,
                position: 6,
                name: 'Развитый разнообразный сверкающий.',
              },
              7: {
                id: 147,
                position: 7,
                name: 'Мелочь виднеться.',
              },
              8: {
                id: 148,
                position: 8,
                name: 'Вытаскивать боец.',
              },
              9: {
                id: 149,
                position: 9,
                name: 'Граница легко покидать.',
              },
              10: {
                id: 150,
                position: 10,
                name: 'Солнце природа точно.',
              },
              11: {
                id: 151,
                position: 11,
                name: 'Вряд домашний разводить естественный.',
              },
              12: {
                id: 152,
                position: 12,
                name: 'Чем тусклый.',
              },
              13: {
                id: 153,
                position: 13,
                name: 'Гулять какой указанный.',
              },
              14: {
                id: 154,
                position: 14,
                name: 'Пространство советовать команда носок.',
              },
              15: {
                id: 155,
                position: 15,
                name: 'Новый инструкция что.',
              },
              16: {
                id: 156,
                position: 16,
                name: 'Танцевать хотеть подземный.',
              },
              17: {
                id: 157,
                position: 17,
                name: 'Мягкий.',
              },
              18: {
                id: 158,
                position: 18,
                name: 'Поговорить.',
              },
              19: {
                id: 159,
                position: 19,
                name: 'Запустить актриса.',
              },
              20: {
                id: 160,
                position: 20,
                name: 'Промолчать.',
              },
            },
          },
          17: {
            id: 17,
            position: 17,
            name: 'Настать славный функция.',
            tasks: {
              0: {
                id: 161,
                position: 0,
                name: 'Хлеб выразить.',
              },
              1: {
                id: 162,
                position: 1,
                name: 'Художественный порядок некоторый.',
              },
              2: {
                id: 163,
                position: 2,
                name: 'Господь армейский невыносимый.',
              },
              3: {
                id: 164,
                position: 3,
                name: 'Ставить выкинуть.',
              },
              4: {
                id: 165,
                position: 4,
                name: 'Порог столетие.',
              },
              5: {
                id: 166,
                position: 5,
                name: 'Изображать палец.',
              },
              6: {
                id: 167,
                position: 6,
                name: 'Отметить угодный дружно.',
              },
              7: {
                id: 168,
                position: 7,
                name: 'Дошлый невыносимый монета.',
              },
              8: {
                id: 169,
                position: 8,
                name: 'Упорно штаб наслаждение.',
              },
              9: {
                id: 170,
                position: 9,
                name: 'Вскакивать изучить тревога.',
              },
              10: {
                id: 171,
                position: 10,
                name: 'Четко магазин.',
              },
              11: {
                id: 172,
                position: 11,
                name: 'Ломать мелочь.',
              },
              12: {
                id: 173,
                position: 12,
                name: 'Поезд премьера.',
              },
              13: {
                id: 174,
                position: 13,
                name: 'Деньги естественный палка.',
              },
              14: {
                id: 175,
                position: 14,
                name: 'Порог коллектив вздрогнуть слишком.',
              },
              15: {
                id: 176,
                position: 15,
                name: 'Сомнительный научить страсть.',
              },
              16: {
                id: 177,
                position: 16,
                name: 'Наслаждение очередной.',
              },
              17: {
                id: 178,
                position: 17,
                name: 'При страсть табак.',
              },
            },
          },
          18: {
            id: 18,
            position: 18,
            name: 'Подробность князь манера.',
            tasks: {
              0: {
                id: 179,
                position: 0,
                name: 'Другой умирать.',
              },
              1: {
                id: 180,
                position: 1,
                name: 'Военный услать зачем.',
              },
              2: {
                id: 181,
                position: 2,
                name: 'Командующий ремень трубка.',
              },
              3: {
                id: 182,
                position: 3,
                name: 'Инструкция сходить мягкий.',
              },
              4: {
                id: 183,
                position: 4,
                name: 'Мера покинуть актриса.',
              },
              5: {
                id: 184,
                position: 5,
                name: 'Неудобно прежде войти освободить.',
              },
              6: {
                id: 185,
                position: 6,
                name: 'Палата.',
              },
              7: {
                id: 186,
                position: 7,
                name: 'Строительство издали.',
              },
              8: {
                id: 187,
                position: 8,
                name: 'Уточнить собеседник.',
              },
              9: {
                id: 188,
                position: 9,
                name: 'Совещание угроза.',
              },
              10: {
                id: 189,
                position: 10,
                name: 'Ломать уничтожение возникновение.',
              },
              11: {
                id: 190,
                position: 11,
                name: 'Расстройство.',
              },
              12: {
                id: 191,
                position: 12,
                name: 'Салон умолять.',
              },
            },
          },
          19: {
            id: 19,
            position: 19,
            name: 'Рай эпоха белье.',
            tasks: {
              0: {
                id: 192,
                position: 0,
                name: 'Приятель идея.',
              },
              1: {
                id: 193,
                position: 1,
                name: 'Заведение результат.',
              },
              2: {
                id: 194,
                position: 2,
                name: 'Волк настать инвалид сутки.',
              },
              3: {
                id: 195,
                position: 3,
                name: 'Экзамен подземный.',
              },
              4: {
                id: 196,
                position: 4,
                name: 'Житель результат.',
              },
              5: {
                id: 197,
                position: 5,
                name: 'Ставить расстегнуть а.',
              },
              6: {
                id: 198,
                position: 6,
                name: 'Бок умолять пол.',
              },
              7: {
                id: 199,
                position: 7,
                name: 'Виднеться иной угол.',
              },
              8: {
                id: 200,
                position: 8,
                name: 'Бабочка страсть интеллектуальный материя.',
              },
              9: {
                id: 201,
                position: 9,
                name: 'Отъезд избегать.',
              },
              10: {
                id: 202,
                position: 10,
                name: 'Задержать волк пропасть.',
              },
              11: {
                id: 203,
                position: 11,
                name: 'Прощение песня стакан.',
              },
              12: {
                id: 204,
                position: 12,
                name: 'Добиться скользить.',
              },
              13: {
                id: 205,
                position: 13,
                name: 'Похороны какой.',
              },
              14: {
                id: 206,
                position: 14,
                name: 'Голубчик освободить протягивать.',
              },
              15: {
                id: 207,
                position: 15,
                name: 'Товар.',
              },
              16: {
                id: 208,
                position: 16,
                name: 'Металл прощение сверкать.',
              },
              17: {
                id: 209,
                position: 17,
                name: 'Прежний ремень.',
              },
              18: {
                id: 210,
                position: 18,
                name: 'Костер.',
              },
              19: {
                id: 211,
                position: 19,
                name: 'Мера прошептать инвалид тысяча.',
              },
              20: {
                id: 212,
                position: 20,
                name: 'Коллектив порт невозможно.',
              },
            },
          },
          20: {
            id: 20,
            position: 20,
            name: 'Домашний возникновение эффект.',
            tasks: {
              0: {
                id: 213,
                position: 0,
                name: 'Песня мимо.',
              },
              1: {
                id: 214,
                position: 1,
                name: 'Спешить.',
              },
              2: {
                id: 215,
                position: 2,
                name: 'Выдержать материя.',
              },
              3: {
                id: 216,
                position: 3,
                name: 'Армейский ботинок.',
              },
              4: {
                id: 217,
                position: 4,
                name: 'Выражаться полюбить.',
              },
              5: {
                id: 218,
                position: 5,
                name: 'Бабочка.',
              },
              6: {
                id: 219,
                position: 6,
                name: 'Роса.',
              },
              7: {
                id: 220,
                position: 7,
                name: 'Тусклый совет.',
              },
              8: {
                id: 221,
                position: 8,
                name: 'Тюрьма смертельный пасть.',
              },
              9: {
                id: 222,
                position: 9,
                name: 'Палец июнь.',
              },
              10: {
                id: 223,
                position: 10,
                name: 'Пропаганда райком сбросить.',
              },
            },
          },
          21: {
            id: 21,
            position: 21,
            name: 'Карман разуметься предоставить.',
            tasks: {
              0: {
                id: 224,
                position: 0,
                name: 'Естественный каюта.',
              },
              1: {
                id: 225,
                position: 1,
                name: 'Второй отметить услать процесс.',
              },
              2: {
                id: 226,
                position: 2,
                name: 'Решетка недостаток.',
              },
              3: {
                id: 227,
                position: 3,
                name: 'Непривычный палец ведь.',
              },
              4: {
                id: 228,
                position: 4,
                name: 'Выразить функция проход.',
              },
            },
          },
          22: {
            id: 22,
            position: 22,
            name: 'Изменение коммунизм.',
            tasks: {
              0: {
                id: 229,
                position: 0,
                name: 'Четко висеть.',
              },
              1: {
                id: 230,
                position: 1,
                name: 'Монета успокоиться недостаток.',
              },
              2: {
                id: 231,
                position: 2,
                name: 'Выражение неправда.',
              },
              3: {
                id: 232,
                position: 3,
                name: 'Труп крыса.',
              },
              4: {
                id: 233,
                position: 4,
                name: 'Табак очко.',
              },
              5: {
                id: 234,
                position: 5,
                name: 'Шлем казнь коллектив ломать.',
              },
              6: {
                id: 235,
                position: 6,
                name: 'Слать единый.',
              },
              7: {
                id: 236,
                position: 7,
                name: 'Рот проход.',
              },
              8: {
                id: 237,
                position: 8,
                name: 'Отдел свежий изменение.',
              },
              9: {
                id: 238,
                position: 9,
                name: 'Голубчик выбирать.',
              },
              10: {
                id: 239,
                position: 10,
                name: 'Неожиданный четыре цвет.',
              },
              11: {
                id: 240,
                position: 11,
                name: 'Пространство наткнуться.',
              },
              12: {
                id: 241,
                position: 12,
                name: 'Что сходить.',
              },
              13: {
                id: 242,
                position: 13,
                name: 'Теория выраженный правый.',
              },
              14: {
                id: 243,
                position: 14,
                name: 'Монета.',
              },
              15: {
                id: 244,
                position: 15,
                name: 'Кольцо скользить карман.',
              },
              16: {
                id: 245,
                position: 16,
                name: 'Идея художественный вздрагивать.',
              },
            },
          },
          23: {
            id: 23,
            position: 23,
            name: 'Четко.',
            tasks: {
              0: {
                id: 246,
                position: 0,
                name: 'Наткнуться.',
              },
              1: {
                id: 247,
                position: 1,
                name: 'Бетонный приличный.',
              },
            },
          },
          24: {
            id: 24,
            position: 24,
            name: 'Наслаждение смертельный.',
            tasks: {
              0: {
                id: 248,
                position: 0,
                name: 'Дьявол.',
              },
              1: {
                id: 249,
                position: 1,
                name: 'Командование.',
              },
              2: {
                id: 250,
                position: 2,
                name: 'Умирать выраженный бровь.',
              },
              3: {
                id: 251,
                position: 3,
                name: 'Зачем карандаш.',
              },
              4: {
                id: 252,
                position: 4,
                name: 'Страсть какой.',
              },
              5: {
                id: 253,
                position: 5,
                name: 'Результат изредка.',
              },
              6: {
                id: 254,
                position: 6,
                name: 'Мучительно манера прошептать.',
              },
              7: {
                id: 255,
                position: 7,
                name: 'Армейский металл.',
              },
              8: {
                id: 256,
                position: 8,
                name: 'Манера изредка металл.',
              },
              9: {
                id: 257,
                position: 9,
                name: 'Оставить расстегнуть командующий.',
              },
              10: {
                id: 258,
                position: 10,
                name: 'Пасть вздрогнуть неудобно.',
              },
              11: {
                id: 259,
                position: 11,
                name: 'Банк космос.',
              },
              12: {
                id: 260,
                position: 12,
                name: 'Костер крыса штаб.',
              },
              13: {
                id: 261,
                position: 13,
                name: 'Триста металл решетка.',
              },
              14: {
                id: 262,
                position: 14,
                name: 'Совет нервно мера похороны.',
              },
              15: {
                id: 263,
                position: 15,
                name: 'Покинуть интеллектуальный.',
              },
              16: {
                id: 264,
                position: 16,
                name: 'Какой райком.',
              },
              17: {
                id: 265,
                position: 17,
                name: 'Адвокат плод идея.',
              },
              18: {
                id: 266,
                position: 18,
                name: 'Равнодушный пропаганда провинция.',
              },
              19: {
                id: 267,
                position: 19,
                name: 'Теория мера недостаток.',
              },
              20: {
                id: 268,
                position: 20,
                name: 'Пол.',
              },
            },
          },
        },
      },
    }),
  }));

// export const taskGetById = (id) => get(`${ApiRoutes.getTasks + id}/`);
export const taskGetById = (id) => Promise.resolve({
  status: 200,
  json: () => Promise.resolve({
    task: {
      id,
      name: 'Таска обыкновенная',
      description: 'Описание необыкновенное, длинное, содержательное. Житель даль валюта. Инфекция ученый плясать упор гулять очередной четыре штаб. Выражение ведь советовать отражение. Висеть пересечь поговорить банк поставить.',
      users: [
        {
          id: 0,
          avatar: '../../img/32.jpg',
        },
      ],
    },
  }),
});

// export const boardsGet = () => get(ApiRoutes.getBoards);
export const boardsGet = () => Promise.resolve({
  status: 200,
  json: () => ({
    boards: [
      {
        id: 5,
        access: 'guest',
        isStared: false,
        name: 'dedeed',
        description: 'hdhhdhdhwjhwd',
      },
      {
        id: 6,
        access: 'guest',
        isStared: false,
        name: 'deldelk',
        description: 'dliekkldele',
      },
      {
        id: 7,
        access: 'guest',
        isStared: false,
        image: '/32.jpg', // ?? для примера, что уже есть фон у карточек
        name: 'cdmc,mc,',
        description: 'dkleldkelde',
      },
      {
        id: 20,
        access: 'guest',
        isStared: false,
        name: '',
        description: '',
      },
      {
        id: 21,
        access: 'guest',
        isStared: false,
        name: '',
        description: '',
      },
      {
        id: 22,
        access: 'guest',
        isStared: false,
        name: '',
        description: '',
      },
      {
        id: 8,
        access: 'guest',
        isStared: false,
        image: '/fon1.jpg',
        name: 'dedemed',
        description: 'dejhjdehjedhe',
      },
      {
        id: 0,
        access: 'admin',
        isStared: false,
        name: '0',
        description: 'Если ты видишь этот текст до конца, то это больша проблема, так как я не нашел нормального решения (не через какие-то древние костыли) как сделать обрезания многострочного текста',
      },
      {
        id: 1,
        access: 'admin',
        isStared: false,
        image: '/35.jpg',
        name: '1',
      },
      {
        id: 26,
        access: 'admin',
        isStared: false,
        name: '',
        description: '',
      },
      {
        id: 27,
        access: 'admin',
        isStared: false,
        name: '',
        description: '',
      },
      {
        id: 28,
        access: 'admin',
        isStared: false,
        name: '',
        description: '',
      },
      {
        id: 29,
        access: 'admin',
        isStared: false,
        name: '',
        description: '',
      },
      {
        id: 3,
        access: 'admin',
        isStared: false,
        image: '/white.png',
        name: '3',
        description: 'Тест тупо белого фона',
      },
    ],
  }),
});

/**
 * @param {!string} name
 */
// export const boardCreate = (name) => postJson(name, ApiRoutes.postBoards);
let debagIdBoardCreate = 666;
// eslint-disable-next-line no-return-assign
export const boardCreate = () => ((id) => Promise.resolve({
  status: 200,
  json: () => ({
    id,
  }),
}))(debagIdBoardCreate += 1);

/**
 * @param {Object} rowInfo
 * @param {number} rowInfo.board_id
 * @param {string} rowInfo.name
 * @param {number} rowInfo.position
 */
// export const rowCreate = (rowInfo) => postJson(rowInfo, ApiRoutes.postRows);
let debagIdRowCreate = 777;
// eslint-disable-next-line no-return-assign
export const rowCreate = () => ((id) => Promise.resolve({
  status: 200,
  json: () => ({
    id,
  }),
}))(debagIdRowCreate += 1);

/**
 * @param {Object} taskInfo
 * @param {number} taskInfo.row_id
 * @param {string} taskInfo.name
 * @param {number} taskInfo.position
 */
// export const taskCreate = (taskInfo) => postJson(taskInfo, ApiRoutes.postTasks);
let debagIdTaskCreate = 888;
// eslint-disable-next-line no-return-assign
export const taskCreate = () => ((id) => Promise.resolve({
  status: 200,
  json: () => ({
    id,
  }),
}))(debagIdTaskCreate += 1);
