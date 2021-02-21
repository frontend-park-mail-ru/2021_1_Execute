/**
 * Класс представляет собой шину событий
 * @class EventBus
 */
export default class EventBus {
  constructor() {
    this.events = new Map();
  }

  /**
   * Функция проверяет имя события
   * @param  {string} eventName - имя события
   * @returns {boolean} - валидно или нет имя события
   */
  static validateEventName(eventName) {
    return typeof eventName === 'string';
  }

  /**
   * Метод позволяет назначить определенному событию функцию-обработчик
   * @param  {string} eventName - имя события
   * @param  {function} handler - функция-обработчик
   * @throws ошибка, если передано невалидное имя события
   * @throws ошибка, если переданный обработчик события - не функция
   */
  subscribe(eventName, handler) {
    if (this.validateEventName(eventName)) {
      throw new Error('Invalid event name');
    }
    if (typeof handler !== 'function') {
      throw new Error('Handler must be a function');
    }
    this.events.set(eventName, handler);
  }

  /**
   * Метод позволяет удалить у определенного события функцию-обработчик
   * @param  {string} eventName - имя события
   * @throws ошибка, если передано невалидное имя события
   */
  unsubscribe(eventName) {
    if (this.validateEventName(eventName)) {
      throw new Error('Invalid event name');
    }
    if (this.events.has(eventName)) {
      this.events.delete(eventName);
    }
  }

  /**
   * Метод позволяет вызвать функцию-обработчик события с переданными данными
   * @param  {string} eventName - имя события
   * @param  {*} data - данные для функции-обработчика события
   * @throws ошибка, если передано невалидное имя события
   * @throws ошибка, если событию не назначен обработчик
   */
  call(eventName, data) {
    if (this.validateEventName(eventName)) {
      throw new Error('Invalid event name');
    }
    if (!this.events.has(eventName)) {
      throw new Error('Missing handler');
    }
    this.events.get(eventName)(data);
  }
}
