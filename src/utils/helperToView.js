/**
 * Запрос на сервер авторизации
 * @param {HTMLElement} elem
 * @return {HTMLElement}
 */
const getNextMessage = (elem) => elem.nextElementSibling.firstElementChild;

export default getNextMessage;
