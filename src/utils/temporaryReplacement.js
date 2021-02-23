/* eslint-disable no-underscore-dangle */
export default class TemporaryReplacement {
  /**
   * Заменяет на N секунд значение в obj[prop] на replacement.
   * Вызов во время ожидания ни к чему не приведет.
   * Использует в obj поле temporaryReplacement.
   * @param {*} obj
   * @param {*} prop
   * @param {*} replacement
   */
  static forNSeconds(obj, prop, replacement, n) {
    if (!obj.temporaryReplacement) {
      obj.temporaryReplacement = {};
    }
    if (!obj.temporaryReplacement[prop]) {
      obj.temporaryReplacement[prop] = true;
      const oldValue = obj[prop];
      obj[prop] = replacement;
      setTimeout(() => {
        obj[prop] = oldValue;
        obj.temporaryReplacement[prop] = false;
      }, n * 1000);
    }
  }

  /**
   * Заменяет на 2 секунды значение в obj[prop] на replacement.
   * Вызов во время ожидания ни к чему не приведет.
   * Использует в obj поле temporaryReplacement.
   * @param {*} obj
   * @param {*} prop
   * @param {*} replacement
   */
  static forTwoSeconds(obj, prop, replacement) {
    this.forNSeconds(obj, prop, replacement, 2);
  }
}
