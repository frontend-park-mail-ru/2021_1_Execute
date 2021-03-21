/**
 * @param {Object} elem
 * @param {?() => any} elem.bufScriptAfter
 * @param {?NodeJS.Timeout} elem.timer
 * @param {() => any} sriptNow
 * @param {() => any} scriptAfter
 * @param {!number} n
 */
function runNowAndAfterNSecondsOrReplace(elem, sriptNow, scriptAfter, n) {
  if (!elem.bufScriptAfter) {
    elem.bufScriptAfter = () => { };
  }
  clearTimeout(elem.timer);
  elem.bufScriptAfter();
  sriptNow();
  elem.bufScriptAfter = scriptAfter;
  if (n !== Infinity) {
    elem.timer = setTimeout(() => elem.bufScriptAfter(), n * 1000);
  }
}

export const makeChecker = (obj) => Object.keys(obj).reduce((checker, key) => {
  checker[key] = {};
  return checker;
}, {});

/**
 * Замена свойства объекта на предложенный на N секунд
 * @param {Object} obj
 * @param {!string} nameProp
 * @param obj[nameProp]
 * @param replacement
 * @param {Object} checker
 * @param {Object} checker[nameProp]
 * @param {boolean} checker[nameProp].blockTR
 * @param checker[nameProp].valueTR
 * @param {number} n
 */
export const replaceObjectPropForNSeconds = (obj, nameProp, replacement, checker, n) => {
  if (!checker[nameProp]) {
    checker[nameProp] = {};
  }
  runNowAndAfterNSecondsOrReplace(checker[nameProp],
    () => {
      checker[nameProp].valueTR = obj[nameProp];
      obj[nameProp] = replacement;
    }, () => {
      obj[nameProp] = checker[nameProp].valueTR;
    }, n);
};

/**
 * Замена свойства объекта на предложенный на одну секунду
 * @param {Object} obj
 * @param {!string} nameProp
 * @param obj[nameProp]
 * @param replacement
 * @param {Object} checker
 * @param {Object} checker[nameProp]
 * @param {boolean} checker[nameProp].blockTR
 * @param checker[nameProp].valueTR
 */
export const replaceObjectPropForSecond = (obj, prop, replacement, checker) => {
  replaceObjectPropForNSeconds(obj, prop, replacement, checker, 1);
};

/**
 * Замена свойства объекта на предложенный на две секунды
 * @param {Object} obj
 * @param {!string} nameProp
 * @param obj[nameProp]
 * @param replacement
 * @param {Object} checker
 * @param {Object} checker[nameProp]
 * @param {boolean} checker[nameProp].blockTR
 * @param checker[nameProp].valueTR
 */
export const replaceObjectPropForTwoSeconds = (obj, prop, replacement, checker) => {
  replaceObjectPropForNSeconds(obj, prop, replacement, checker, 2);
};

/**
 * Замена свойства объекта на предложенный навсегда (для реализации "возвращения" после следующего
 * изменения)
 * @param {Object} obj
 * @param {!string} nameProp
 * @param obj[nameProp]
 * @param replacement
 * @param {Object} checker
 * @param {Object} checker[nameProp]
 * @param {boolean} checker[nameProp].blockTR
 * @param checker[nameProp].valueTR
 */
export const replaceObjectPropForEver = (obj, prop, replacement, checker) => {
  replaceObjectPropForNSeconds(obj, prop, replacement, checker, Infinity);
};

/**
 * Замена CSS классов элемента на предложенные на N секунд
 * @param {HTMLElement} elem
 * @param {!string[]} classNamesAdd
 * @param {!string[]} classNamesDelete
 * @param {Object} checker
 * @param {Object} checker.add
 * @param {boolean} checker.add.blockTR
 * @param {number} n
 */
export const replaceClassForNSeconds = (elem, classNamesAdd, classNamesDelete, checker, n) => {
  if (!checker.add) {
    checker.add = {};
  }
  runNowAndAfterNSecondsOrReplace(checker.add,
    () => {
      elem.classList.remove(...classNamesDelete);
      elem.classList.add(...classNamesAdd);
    }, () => {
      elem.classList.remove(...classNamesAdd);
      elem.classList.add(...classNamesDelete);
    }, n);
};

/**
 * Замена CSS классов элемента на предложенные на одну секунду
 * @param {HTMLElement} elem
 * @param {!string[]} classNamesAdd
 * @param {!string[]} classNamesDelete
 * @param {Object} checker
 * @param {Object} checker.add
 * @param {boolean} checker.add.blockTR
 */
export const replaceClassForSecond = (elem, classNamesAdd, classNamesDelete, checker) => {
  replaceClassForNSeconds(elem, classNamesAdd, classNamesDelete, checker, 1);
};

/**
 * Замена CSS классов элемента на предложенные на две секунды
 * @param {HTMLElement} elem
 * @param {!string[]} classNamesAdd
 * @param {!string[]} classNamesDelete
 * @param {Object} checker
 * @param {Object} checker.add
 * @param {boolean} checker.add.blockTR
 */
export const replaceClassForTwoSeconds = (elem, classNamesAdd, classNamesDelete, checker) => {
  replaceClassForNSeconds(elem, classNamesAdd, classNamesDelete, checker, 2);
};

/**
 * Замена CSS классов элемента на предложенные навсегда (для реализации "возвращения" после
 * следующего изменения)
 * @param {HTMLElement} elem
 * @param {!string[]} classNamesAdd
 * @param {!string[]} classNamesDelete
 * @param {Object} checker
 * @param {Object} checker.add
 * @param {boolean} checker.add.blockTR
 */
export const replaceClassForEver = (elem, classNamesAdd, classNamesDelete, checker) => {
  replaceClassForNSeconds(elem, classNamesAdd, classNamesDelete, checker, Infinity);
};

/**
 * Замена CSS класса блока текста на типовой на две секунды
 * @param {HTMLElement} elem
 * @param {!string} type
 * @param {Object} checker
 */
export const replaceTextboxClassForTwoSeconds = (elem, type, checker) => {
  replaceClassForTwoSeconds(elem, [`menu-textbox-${type}`], [], checker);
};

/**
 * Замена CSS класса блока текста на типовой навсегда
 * @param {HTMLElement} elem
 * @param {!string} type
 * @param {Object} checker
 */
export const replaceTextboxClassForEver = (elem, type, checker) => {
  replaceClassForEver(elem, [`menu-textbox-${type}`], [], checker);
};

/**
 * Замена CSS класса блока текста на типовой и вызов сообщения того же типа на две секунды
 * @param {HTMLElement} elem
 * @param {!string} type
 * @param {Object} checker
 */
export const replaceTextboxClassAndMessageForTwoSeconds = (elem, type, checker) => {
  replaceClassForTwoSeconds(elem, [`menu-textbox-${type}`, `call-message-${type}`], [], checker);
};

/**
 * Замена CSS класса блока текста на типовой и вызов сообщения того же типа навсегда
 * @param {HTMLElement} elem
 * @param {!string} type
 * @param {Object} checker
 */
export const replaceTextboxClassAndMessageForEver = (elem, type, checker) => {
  replaceClassForEver(elem, [`menu-textbox-${type}`, `call-message-${type}`], [], checker);
};
