function runNowAndAfterNSeconds(sriptNow, scriptAfter, n) {
  sriptNow();
  setTimeout(scriptAfter, n * 1000);
}

export const makeChecker = (obj) => Object.keys(obj).reduce((checker, key) => {
  checker[key] = {};
  return checker;
}, {});

export class InObjectProperty {
  static forNSeconds(obj, nameProp, replacement, checker, n) {
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
  }

  static forTwoSeconds(obj, prop, replacement, checker) {
    this.forNSeconds(obj, prop, replacement, checker, 2);
  }
}

export class InElementClass {
  static forNSeconds(elem, classNamesAdd, classNamesDelete, checker, n) {
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
  }

  static forTwoSeconds(elem, classNamesAdd, classNamesDelete, checker) {
    this.forNSeconds(elem, classNamesAdd, classNamesDelete, checker, 2);
  }
}
