import './login.handlebars.js';
import { makeChecker, replaceCssClassForTwoSeconds, replaceObjectPropForTwoSeconds } from '../utils/temporaryReplacement.js';
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
    this.buttonEnter.addEventListener('click', () => this.eventBus.call(LoginEvents.clickEnter, {
      username: this.inputUserName.value, password: this.inputPassword.value,
    }));
    this.buttonGotoRegistration.addEventListener('click', () => this.eventBus.call(LoginEvents.registration));
    this.eventBus.subscribe(LoginEvents.loginError, (message) => this.handleLoginError(message));
  }

  handleLoginError(message) {
    replaceCssClassForTwoSeconds(this.textboxUserName, ['menu-textbox-error'], [], this.checker.textboxUserName);
    replaceCssClassForTwoSeconds(this.textboxPassword, ['menu-textbox-error'], [], this.checker.textboxPassword);
    replaceCssClassForTwoSeconds(this.buttonEnter, ['menu-btn-error'], ['menu-btn-success'], this.checker.buttonEnter);
    replaceObjectPropForTwoSeconds(this.buttonEnter, 'innerText', message, this.checker.buttonEnter);
  }
}
