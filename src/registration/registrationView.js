import './registration.handlebars.js';
import { makeChecker, replaceCssClassForTwoSeconds, replaceObjectPropForTwoSeconds } from '../utils/temporaryReplacement.js';
import RegistrationEvents from './registrationEvents.js';

export default class LoginView {
  /**
   * @param {!EventBus}
   * @return {!LoginView}
   */
  constructor(eventBus) {
    this.eventBus = eventBus;
  }

  render(root) {
    // eslint-disable-next-line no-undef
    root.innerHTML = Handlebars.templates.registration();
    this.findNeedElem();
    this.addEventListeners();
  }

  findNeedElem() {
    this.textboxUserEmail = document.getElementById('textbox-e-mail');
    this.textboxUserName = document.getElementById('textbox-username');
    this.textboxPassword = document.getElementById('textbox-password');
    this.textboxRepeatPassword = document.getElementById('textbox-repeat-password');
    this.inputUserEmail = document.getElementById('e-mail');
    this.inputUserName = document.getElementById('username');
    this.inputPassword = document.getElementById('password');
    this.inputRepeatPassword = document.getElementById('repeat-password');
    this.buttonEnter = document.getElementById('enter');
    this.buttonGotoLogin = document.getElementById('goto-login');
    this.checker = makeChecker(this);
  }

  addEventListeners() {
    this.buttonEnter.addEventListener('click', () => this.eventBus.call(RegistrationEvents.clickEnter, {
      email: this.inputUserEmail.value,
      username: this.inputUserName.value,
      password: this.inputPassword.value,
      repeatPassword: this.inputRepeatPassword.value,
    }));
    this.buttonGotoLogin.addEventListener('click', () => this.eventBus.call(RegistrationEvents.login));
    this.eventBus.subscribe(RegistrationEvents.registrationError,
      (message) => this.handleRegistrationError(message));
  }

  handleRegistrationError(message) {
    replaceCssClassForTwoSeconds(this.textboxUserEmail, ['menu-textbox-error'], [], this.checker.textboxUserEmail);
    replaceCssClassForTwoSeconds(this.textboxUserName, ['menu-textbox-error'], [], this.checker.textboxUserName);
    replaceCssClassForTwoSeconds(this.textboxPassword, ['menu-textbox-error'], [], this.checker.textboxPassword);
    replaceCssClassForTwoSeconds(this.textboxRepeatPassword, ['menu-textbox-error'], [], this.checker.textboxRepeatPassword);
    replaceCssClassForTwoSeconds(this.buttonEnter, ['menu-btn-error'], ['menu-btn-success'], this.checker.buttonEnter);
    replaceObjectPropForTwoSeconds(this.buttonEnter, 'innerText', message, this.checker.buttonEnter);
  }
}
