import './login.handlebars.js';
import {
  makeChecker,
  replaceObjectPropForSecond,
  replaceClassForSecond,
  replaceTextboxClassForTwoSeconds,
  replaceTextboxClassAndMessageForTwoSeconds,
  replaceTextboxClassAndMessageForEver,
} from '../utils/temporaryReplacement.js';
import { LoginEvents } from './loginEvents.js';
import { getNextMessage } from '../utils/helperToView.js';

export default class LoginView {
  /**
   * @param {!EventBus}
   * @return {!LoginView}
   */
  constructor(eventBus, root) {
    this.root = root;
    this.eventBus = eventBus;
    this.eventBus.subscribe(LoginEvents.loginWait, (message) => this.handleLoginWait(message));
    this.eventBus.subscribe(LoginEvents.loginError, (message) => this.handleLoginError(message));
    this.eventBus.subscribe(LoginEvents.render, this.render.bind(this));
  }

  render() {
    // eslint-disable-next-line no-undef
    this.root.innerHTML = Handlebars.templates.login();
    this.findNeedElem();
    this.addEventListeners();
  }

  findNeedElem() {
    this.textboxEmail = document.getElementById('textbox-email');
    this.textboxPassword = document.getElementById('textbox-password');
    this.inputEmail = document.getElementById('email');
    this.inputPassword = document.getElementById('password');
    this.messageAfterPassword = getNextMessage(this.textboxPassword);
    this.buttonEnter = document.getElementById('enter');
    this.buttonGotoRegistration = document.getElementById('goto-registration');
    this.checker = makeChecker(this);
  }

  addEventListeners() {
    this.buttonEnter.addEventListener('click', () => {
      replaceClassForSecond(this.buttonEnter, ['menu-btn-wait'], ['menu-btn-success'], this.checker.buttonEnter);
      replaceObjectPropForSecond(this.buttonEnter, 'disabled', true, this.checker.buttonEnter);
      this.eventBus.call(LoginEvents.clickEnter, {
        email: this.inputEmail.value, password: this.inputPassword.value,
      });
    });
    this.buttonGotoRegistration.addEventListener('click', () => this.eventBus.call(LoginEvents.registration));
  }

  handleLoginWait(message) {
    replaceTextboxClassAndMessageForEver(this.textboxPassword, 'wait', this.checker.textboxPassword);
    this.messageAfterPassword.innerHTML = message;
  }

  handleLoginError(message) {
    replaceTextboxClassForTwoSeconds(this.textboxEmail, 'error', this.checker.textboxEmail);
    replaceTextboxClassAndMessageForTwoSeconds(this.textboxPassword, 'error', this.checker.textboxPassword);
    this.messageAfterPassword.innerHTML = message;
  }
}
