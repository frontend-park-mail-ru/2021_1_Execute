import './login.handlebars.js';
import ValidationModule from '../utils/validationModule.js';
import TemporaryReplacement from '../utils/temporaryReplacement.js';
import LoginEvents from './loginEvents.js';

export default class LoginView {
  /**
   * @param {!EventBus}
   * @return {!LoginView}
   */
  constructor(eventBus) {
    this.eventBus = eventBus;
  }

  render(root, profile) {
    // eslint-disable-next-line no-undef
    root.innerHTML = Handlebars.templates.login(profile);
    this.findNeedElem();
    this.addEventListeners();
  }

  findNeedElem() {
    this.textboxUserName = document.getElementById('textbox-username');
    this.textboxPassword = document.getElementById('textbox-password');
    this.inputUserName = document.getElementById('username');
    this.inputPassword = document.getElementById('password');
    this.buttonEnter = document.getElementById('enter');
    this.buttonGotoRegistration = document.getElementById('goto-registration');
    this.checker = TemporaryReplacement.makeChecker(this);
  }

  addEventListeners() {
    this.buttonEnter.addEventListener('click',
      () => this.eventBus.call(LoginEvents.clickEnter,
        { username: this.inputUserName.value, password: this.inputPassword.value }));
    this.buttonGotoRegistration.addEventListener('click',
      () => this.eventBus.call(LoginEvents.clickGoToRegistration));

    this.eventBus.subscribe(LoginEvents.handleLoginWarning, this.handleLoginWarning);
    this.eventBus.subscribe(LoginEvents.handleLoginError, this.handleLoginError);
  }

  handleLoginWarning(warning) {
    if (warning.correctUserName === ValidationModule.UNCORRECT_PARSE) {
      TemporaryReplacement.InElementClass.forTwoSeconds(
        this.textboxUserName, ['menu-textbox-warning'], [], this.checker.textboxUserName,
      );
    }
    if (warning.correctPassword === ValidationModule.UNCORRECT_PARSE) {
      TemporaryReplacement.InElementClass.forTwoSeconds(
        this.textboxPassword, ['menu-textbox-warning'], [], this.checker.textboxPassword,
      );
    }
    TemporaryReplacement.InElementClass.forTwoSeconds(
      this.buttonEnter, ['menu-btn-warning'], ['menu-btn-grey', 'menu-btn-active-green'], this.checker.buttonEnter,
    );
    TemporaryReplacement.InObjectProperty.forTwoSeconds(
      this.buttonEnter, 'innerText', 'Некорректные данные', this.checker.buttonEnter,
    );
  }

  handleLoginError() {
    TemporaryReplacement.InElementClass.forTwoSeconds(
      this.textboxUserName, ['menu-textbox-error'], this.checker.textboxUserName,
    );
    TemporaryReplacement.InElementClass.forTwoSeconds(
      this.textboxPassword, ['menu-textbox-error'], this.checker.textboxPassword,
    );
    TemporaryReplacement.InElementClass.forTwoSeconds(
      this.buttonEnter, ['menu-btn-error'], this.checker.buttonEnter,
    );
    TemporaryReplacement.InObjectProperty.forTwoSeconds(
      this.buttonEnter, 'innerText', 'Неверные данные', this.checker.buttonEnter,
    );
  }
}
