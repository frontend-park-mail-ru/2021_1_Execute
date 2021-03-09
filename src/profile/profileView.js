import Handlebars from './profile.handlebars.js';
import { makeChecker, replaceCssClassForTwoSeconds, replaceObjectPropForTwoSeconds } from '../utils/temporaryReplacement.js';
import { ProfileEvent, ProfileMessage } from './profileEvents.js';

export default class ProfileView {
  /**
   * @param {!EventBus}
   * @return {!ProfileView}
   */
  constructor(eventBus) {
    this.eventBus = eventBus;
  }

  render(root) {
    // eslint-disable-next-line no-undef
    const data = this.eventBus.call(ProfileEvent.getData);
    if (!data.photo) {
      data.photo = '/img/not-available.png';
    }
    root.innerHTML = Handlebars.templates.profile(data);
    this.findNeedElem();
    this.addEventListeners();
  }

  findNeedElem() {
    this.textboxUserName = document.getElementById('textbox-username');
    this.textboxPassword = document.getElementById('textbox-password');
    this.textboxRepeatPassword = document.getElementById('textbox-repeat-password');
    this.inputEMail = document.getElementById('e-mail');
    this.inputUserName = document.getElementById('username');
    this.inputPassword = document.getElementById('password');
    this.inputRepeatPassword = document.getElementById('repeat-password');
    this.buttonExit = document.getElementById('exit');
    this.buttonChangeData = document.getElementById('change-data');
    this.checker = makeChecker(this);
  }

  addEventListeners() {
    this.buttonExit.addEventListener('click', () => this.eventBus.call(ProfileEvent.login));
    this.buttonChangeData.addEventListener('click', () => this.eventBus.call(ProfileEvent.clickChangeData, {
      email: this.inputEMail.value,
      username: this.inputUserName.value,
      password: this.inputPassword.value,
      repeatPassword: this.inputRepeatPassword.value,
    }));
    this.eventBus.subscribe(ProfileEvent.profileError,
      (message) => this.handleProfileError(message));
    this.eventBus.subscribe(ProfileEvent.profileSuccess,
      (message) => this.handleProfileSuccess(message));
  }

  handleProfileError(message) {
    switch (message) {
      case ProfileMessage.usernameErrorValidation:
      case ProfileMessage.usernameErrorServer:
        replaceCssClassForTwoSeconds(this.textboxUserName, ['menu-textbox-error'], [], this.checker.textboxUserName);
        break;
      case ProfileMessage.passwordErrorValidation:
      case ProfileMessage.repeatPasswordErrorValidation:
        replaceCssClassForTwoSeconds(this.textboxPassword, ['menu-textbox-error'], [], this.checker.textboxPassword);
        replaceCssClassForTwoSeconds(this.textboxRepeatPassword, ['menu-textbox-error'], [], this.checker.textboxRepeatPassword);
        break;
      default:
    }
    replaceObjectPropForTwoSeconds(this.buttonChangeData, 'innerText', message, this.checker.buttonChangeData);
  }

  handleProfileSuccess({ message }) {
    replaceCssClassForTwoSeconds(this.textboxUserName, ['menu-textbox-success'], [], this.checker.textboxUserName);
    replaceCssClassForTwoSeconds(this.textboxPassword, ['menu-textbox-success'], [], this.checker.textboxPassword);
    replaceCssClassForTwoSeconds(this.textboxRepeatPassword, ['menu-textbox-success'], [], this.checker.textboxRepeatPassword);
    replaceObjectPropForTwoSeconds(this.buttonChangeData, 'innerText', message, this.checker.buttonExit);
  }
}
