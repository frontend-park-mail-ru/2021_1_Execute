import './profile.handlebars.js';
import { makeChecker, replaceCssClassForTwoSeconds, replaceObjectPropForTwoSeconds } from '../utils/temporaryReplacement.js';
import { ProfileEvent, ProfileMessage } from './profileEvents.js';

export default class ProfileView {
  /**
   * @param {!EventBus}
   * @return {!ProfileView}
   */
  constructor(eventBus, root) {
    this.root = root;
    this.eventBus = eventBus;
    this.eventBus.subscribe(ProfileEvent.renderData, (data) => this.renderData(data));
  }

  renderData(data) {
    // eslint-disable-next-line no-undef
    this.root.innerHTML = Handlebars.templates.profile(data.user);
    this.findNeedElem();
    this.addEventListeners();
  }

  findNeedElem() {
    this.photoAvatar = document.getElementById('avatar-photo');
    this.inputAvatar = document.getElementById('avatar-input');
    this.textboxUserName = document.getElementById('textbox-username');
    this.textboxPassword = document.getElementById('textbox-password');
    this.textboxEmail = document.getElementById('textbox-email');
    this.textboxRepeatPassword = document.getElementById('textbox-repeat-password');
    this.inputEmail = document.getElementById('email');
    this.inputUserName = document.getElementById('username');
    this.inputPassword = document.getElementById('password');
    this.inputRepeatPassword = document.getElementById('repeat-password');
    this.buttonExit = document.getElementById('exit');
    this.buttonChangeData = document.getElementById('change-data');
    this.checker = makeChecker(this);
  }

  addEventListeners() {
    this.buttonExit.addEventListener('click', () => this.eventBus.call(ProfileEvent.exit));
    this.buttonChangeData.addEventListener('click', () => this.eventBus.call(ProfileEvent.clickChangeData, {
      email: this.inputEmail.value,
      username: this.inputUserName.value,
      password: this.inputPassword.value,
      repeatPassword: this.inputRepeatPassword.value,
    }));
    this.inputAvatar.addEventListener('change', () => this.eventBus.call(ProfileEvent.clickChangeAvatar, this.inputAvatar.files[0]));
    this.eventBus.subscribe(ProfileEvent.changeAvatarToBuffer,
      (file) => this.changeAvatarToBuffer(file));
  }

  /**
   * @param {File} avatar
   */
  changeAvatarToBuffer(avatar) {
    if (avatar) {
      this.photoAvatar.onload = () => URL.revokeObjectURL(this.photoAvatar.src);
      this.photoAvatar.src = URL.createObjectURL(avatar);
    } else {
      this.photoAvatar.src = '';
    }
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
      case ProfileMessage.emailErrorValidation:
        replaceCssClassForTwoSeconds(this.textboxEmail, ['menu-textbox-error'], [], this.checker.textboxEmail);
        break;
      default:
    }
    replaceObjectPropForTwoSeconds(this.buttonChangeData, 'innerText', message, this.checker.buttonChangeData);
  }

  handleProfileSuccess({ message }) {
    replaceCssClassForTwoSeconds(this.textboxEmail, ['menu-textbox-success'], [], this.checker.textboxEmail);
    replaceCssClassForTwoSeconds(this.textboxUserName, ['menu-textbox-success'], [], this.checker.textboxUserName);
    replaceCssClassForTwoSeconds(this.textboxPassword, ['menu-textbox-success'], [], this.checker.textboxPassword);
    replaceCssClassForTwoSeconds(this.textboxRepeatPassword, ['menu-textbox-success'], [], this.checker.textboxRepeatPassword);
    replaceObjectPropForTwoSeconds(this.buttonChangeData, 'innerText', message, this.checker.buttonExit);
  }
}
