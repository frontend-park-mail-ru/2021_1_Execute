import './login.handlebars.js';
import {
  makeChecker,
  replaceObjectPropForSecond, replaceCssClassForSecond,
  replaceObjectPropForTwoSeconds, replaceCssClassForTwoSeconds,
  replaceCssClassForInfinity,
} from '../utils/temporaryReplacement.js';
import { LoginEvents } from './loginEvents.js';
import getNextMessage from '../utils/helperToView.js';

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
    root.innerHTML = Handlebars.templates.login();
    this.findNeedElem();
    this.addEventListeners();
  }

  findNeedElem() {
    this.textboxEmail = document.getElementById('textbox-email');
    this.textboxPassword = document.getElementById('textbox-password');
    this.inputEmail = document.getElementById('email');
    this.inputPassword = document.getElementById('password');
    this.messageAfterPassword = getNextMessage(this.inputPassword);
    this.buttonEnter = document.getElementById('enter');
    this.buttonGotoRegistration = document.getElementById('goto-registration');
    this.checker = makeChecker(this);
  }

  addEventListeners() {
    this.buttonEnter.addEventListener('click', () => this.eventBus.call(LoginEvents.clickEnter, {
      email: this.inputEmail.value, password: this.inputPassword.value,
    }));
    this.buttonGotoRegistration.addEventListener('click', () => this.eventBus.call(LoginEvents.registration));
    this.eventBus.subscribe(LoginEvents.loginError, (message) => this.handleLoginError(message));
    this.eventBus.subscribe(LoginEvents.loginWait, (message) => this.handleLoginWait(message));
  }

  handleLoginWait(message) {
    replaceCssClassForInfinity(this.textboxEmail, ['menu-textbox-wait'], [], this.checker.textboxEmail);
    replaceCssClassForInfinity(this.textboxPassword, ['menu-textbox-wait'], [], this.checker.textboxPassword);
    replaceCssClassForSecond(this.buttonEnter, ['menu-btn-wait'], ['menu-btn-success'], this.checker.buttonEnter);
    replaceObjectPropForSecond(this.buttonEnter, 'disabled', true, this.checker.buttonEnter);
    this.messageAfterPassword.innerHTML = message;
  }

  handleLoginError(message) {
    replaceCssClassForTwoSeconds(this.textboxEmail, ['menu-textbox-error'], [], this.checker.textboxEmail);
    replaceCssClassForTwoSeconds(this.textboxPassword, ['menu-textbox-error'], [], this.checker.textboxPassword);
    this.messageAfterPassword.innerHTML = message;
  }
}
