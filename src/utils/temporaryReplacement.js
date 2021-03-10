function runNowAndAfterNSeconds(sriptNow, scriptAfter, n) {
  sriptNow();
  setTimeout(scriptAfter, n * 1000);
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
export const replaceObjectPropForNSec = (obj, nameProp, replacement, checker, n) => {
  if (!checker[nameProp]) {
    checker[nameProp] = {};
  }
  if (!checker[nameProp].blockTR) {
    runNowAndAfterNSeconds(() => {
      checker[nameProp].blockTR = true;
      checker[nameProp].valueTR = obj[nameProp];
      obj[nameProp] = replacement;
    }, () => {
      obj[nameProp] = checker[nameProp].valueTR;
      checker[nameProp].blockTR = false;
    }, n);
  }
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
  replaceObjectPropForNSec(obj, prop, replacement, checker, 2);
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
export const replaceCssClassForNSec = (elem, classNamesAdd, classNamesDelete, checker, n) => {
  if (!checker.add) {
    checker.add = {};
  }
  if (!checker.add.blockTR) {
    runNowAndAfterNSeconds(() => {
      checker.add.blockTR = true;
      elem.classList.remove(...classNamesDelete);
      elem.classList.add(...classNamesAdd);
    }, () => {
      elem.classList.remove(...classNamesAdd);
      elem.classList.add(...classNamesDelete);
      checker.add.blockTR = false;
    }, n);
  }
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
export const replaceCssClassForTwoSeconds = (elem, classNamesAdd, classNamesDelete, checker) => {
  replaceCssClassForNSec(elem, classNamesAdd, classNamesDelete, checker, 2);
};
