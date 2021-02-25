import './login.handlebars.js';
import { makeChecker, InElementClass, InObjectProperty } from '../utils/temporaryReplacement.js';
import LoginEvents from './loginEvents.js';

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
    this.textboxUserName = document.getElementById('textbox-username');
    this.textboxPassword = document.getElementById('textbox-password');
    this.inputUserName = document.getElementById('username');
    this.inputPassword = document.getElementById('password');
    this.buttonEnter = document.getElementById('enter');
    this.buttonGotoRegistration = document.getElementById('goto-registration');
    this.checker = makeChecker(this);
  }

  addEventListeners() {
    console.log(this);
    this.buttonEnter.addEventListener('click', () => this.eventBus.call(LoginEvents.clickEnter,
      { username: this.inputUserName.value, password: this.inputPassword.value }));
    this.buttonGotoRegistration.addEventListener('click', () => this.eventBus.call(LoginEvents.registration));
    this.eventBus.subscribe(LoginEvents.loginError, this.handleLoginError);
  }

  handleLoginError(message) {
    console.log(message, this);
    InElementClass.forTwoSeconds(this.textboxUserName, ['menu-textbox-error'], this.checker.textboxUserName);
    InElementClass.forTwoSeconds(this.textboxPassword, ['menu-textbox-error'], this.checker.textboxPassword);
    InElementClass.forTwoSeconds(this.buttonEnter, ['menu-btn-error'], this.checker.buttonEnter);
    InObjectProperty.forTwoSeconds(this.buttonEnter, 'innerText', message, this.checker.buttonEnter);
  }
}
