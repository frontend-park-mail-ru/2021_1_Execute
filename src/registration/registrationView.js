import registrationTemplate from './registration.handlebars';
import {
  makeChecker,
  replaceClassForSecond, replaceObjectPropForSecond,
  replaceTextboxClassAndMessageForEver,
  replaceTextboxClassAndMessageForTwoSeconds,
} from '../utils/temporaryReplacement.js';
import { RegistrationEvents, RegistrationMessage } from './registrationEvents.js';
import { getNextMessage } from '../utils/helperToView.js';

export default class LoginView {
  /**
   * @param {!EventBus}
   * @return {!LoginView}
   */
  constructor(eventBus, root) {
    this.root = root;
    this.eventBus = eventBus;
    this.eventBus.subscribe(RegistrationEvents.registrationWait,
      (message) => this.handleRegistrationWait(message));
    this.eventBus.subscribe(RegistrationEvents.registrationError,
      (message) => this.handleRegistrationError(message));
    this.eventBus.subscribe(RegistrationEvents.render, this.render.bind(this));
  }

  render() {
    this.root.innerHTML = registrationTemplate();
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
    this.messageAfterEmail = getNextMessage(this.textboxUserEmail);
    this.messageAfterUsername = getNextMessage(this.textboxUserName);
    this.messageAfterPassword = getNextMessage(this.textboxPassword);
    this.messageAfterRepeatPassword = getNextMessage(this.textboxRepeatPassword);
    this.inputRepeatPassword = document.getElementById('repeat-password');
    this.buttonEnter = document.getElementById('enter');
    this.buttonGotoLogin = document.getElementById('goto-login');
    this.checker = makeChecker(this);
  }

  addEventListeners() {
    this.buttonEnter.addEventListener('click', () => {
      replaceClassForSecond(this.buttonEnter, ['menu-btn-wait'], ['menu-btn-success'], this.checker.buttonEnter);
      replaceObjectPropForSecond(this.buttonEnter, 'disabled', true, this.checker.buttonEnter);
      this.eventBus.call(RegistrationEvents.clickEnter, {
        email: this.inputUserEmail.value,
        username: this.inputUserName.value,
        password: this.inputPassword.value,
        repeatPassword: this.inputRepeatPassword.value,
      });
    });
    this.buttonGotoLogin.addEventListener('click', () => this.eventBus.call(RegistrationEvents.login));
  }

  handleRegistrationWait(message) {
    replaceTextboxClassAndMessageForEver(this.textboxRepeatPassword, 'wait', this.checker.textboxRepeatPassword);
    this.messageAfterRepeatPassword.innerHTML = message;
  }

  handleRegistrationError(message) {
    replaceClassForSecond(this.textboxRepeatPassword,
      [], [], this.checker.textboxRepeatPassword);
    switch (message) {
      case RegistrationMessage.emailNonUniq:
      case RegistrationMessage.emailErrorValidation:
        replaceTextboxClassAndMessageForTwoSeconds(this.textboxUserEmail, 'error', this.checker.textboxUserEmail);
        this.messageAfterEmail.innerHTML = message;
        break;
      case RegistrationMessage.usernameErrorValidation:
        replaceTextboxClassAndMessageForTwoSeconds(this.textboxUserName, 'error', this.checker.textboxUserName);
        this.messageAfterUsername.innerHTML = message;
        break;
      case RegistrationMessage.passwordErrorValidation:
        replaceTextboxClassAndMessageForTwoSeconds(this.textboxPassword, 'error', this.checker.textboxPassword);
        this.messageAfterPassword.innerHTML = message;
        break;
      default:
      case RegistrationMessage.repeatPasswordErrorValidation:
        replaceTextboxClassAndMessageForTwoSeconds(this.textboxRepeatPassword, 'error', this.checker.textboxRepeatPassword);
        this.messageAfterRepeatPassword.innerHTML = message;
        break;
    }
  }
}
