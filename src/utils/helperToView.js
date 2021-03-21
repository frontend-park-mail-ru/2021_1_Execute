/**
 * Вернуть следующий элемент, если это сообщение
 * @param {Element} elem
 * @return {Element|null}
 */
export const getNextMessage = (elem) => (elem.nextElementSibling
  && elem.nextElementSibling.classList.contains('menu-father-message')
  ? elem.nextElementSibling.firstElementChild : null);

export default getNextMessage;
