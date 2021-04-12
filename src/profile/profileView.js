import './profile.handlebars.js';
import {
  makeChecker,
  replaceObjectPropForSecond,
  replaceClassForTwoSeconds,
  replaceClassForEver,
  replaceTextboxClassAndMessageForTwoSeconds,
  replaceTextboxClassForTwoSeconds,
  replaceClassForSecond,
  replaceTextboxClassAndMessageForEver,
} from '../utils/temporaryReplacement.js';
import { ProfileEvent, ProfileMessage } from './profileEvents.js';
import { getNextMessage } from '../utils/helperToView.js';

export default class ProfileView {
  /**
   * @param {!EventBus}
   * @return {!ProfileView}
   */
  constructor(eventBus, root) {
    this.root = root;
    this.eventBus = eventBus;
    this.eventBus.subscribe(ProfileEvent.renderData, (data) => this.renderData(data));
    this.eventBus.subscribe(ProfileEvent.changeAvatarToBuffer,
      (file) => this.changeAvatarToBuffer(file));
    this.eventBus.subscribe(ProfileEvent.originalAvatarFromBuffer,
      this.originalAvatarFromBuffer.bind(this));
    this.eventBus.subscribe(ProfileEvent.clearAvatarBuffer,
      this.clearAvatarBuffer.bind(this));
    this.eventBus.subscribe(ProfileEvent.profileAvatarWait,
      (message) => this.handleProfileAvatarWait(message));
    this.eventBus.subscribe(ProfileEvent.profileAvatarError,
      (message) => this.handleProfileAvatarError(message));
    this.eventBus.subscribe(ProfileEvent.profileAvatarSuccess,
      (message) => this.handleProfileAvatarSuccess(message));
    this.eventBus.subscribe(ProfileEvent.profileFormWait,
      (message) => this.handleProfileFormWait(message));
    this.eventBus.subscribe(ProfileEvent.profileFormError,
      (message) => this.handleProfileFormError(message));
    this.eventBus.subscribe(ProfileEvent.profileFormSuccess,
      (message) => this.handleProfileFormSuccess(message));
  }

  renderData(data) {
    // eslint-disable-next-line no-undef
    this.root.innerHTML = Handlebars.templates.profile(data.user);
    this.findNeedElem();
    this.addEventListeners();
  }

  findNeedElem() {
    this.photoAvatar = document.getElementById('avatar-photo');
    this.blockAvatar = this.photoAvatar.parentElement;
    this.textboxEmail = document.getElementById('textbox-email');
    this.textboxUserName = document.getElementById('textbox-username');
    this.textboxPassword = document.getElementById('textbox-password');
    this.textboxRepeatPassword = document.getElementById('textbox-repeat-password');
    this.inputAvatar = document.getElementById('avatar-input');
    this.inputEmail = document.getElementById('email');
    this.inputUserName = document.getElementById('username');
    this.inputPassword = document.getElementById('password');
    this.inputRepeatPassword = document.getElementById('repeat-password');
    this.messageAfterAvatar = getNextMessage(this.blockAvatar);
    this.messageAfterEmail = getNextMessage(this.textboxEmail);
    this.messageAfterUsername = getNextMessage(this.textboxUserName);
    this.messageAfterPassword = getNextMessage(this.textboxPassword);
    this.messageAfterRepeatPassword = getNextMessage(this.textboxRepeatPassword);
    this.buttonExit = document.getElementById('exit');
    this.buttonChangeData = document.getElementById('change-data');
    this.checker = makeChecker(this);
  }

  addEventListeners() {
    this.inputAvatar.addEventListener('change', () => this.eventBus.call(ProfileEvent.clickChangeAvatar, this.inputAvatar.files[0]));
    this.buttonExit.addEventListener('click', () => this.eventBus.call(ProfileEvent.exit));
    this.buttonChangeData.addEventListener('click', () => {
      replaceObjectPropForSecond(this.buttonChangeData, 'disabled', true, this.checker.buttonChangeData);
      this.eventBus.call(ProfileEvent.clickChangeData, {
        email: this.inputEmail.value,
        username: this.inputUserName.value,
        password: this.inputPassword.value,
        repeatPassword: this.inputRepeatPassword.value,
      });
      if (this.photoAvatar.dataset.buffer) {
        this.eventBus.call(ProfileEvent.clickChangeAvatar, this.inputAvatar.files[0], true);
        this.inputAvatar.value = '';
      }
    });
  }

  /**
   * @param {File} avatar
   */
  changeAvatarToBuffer(avatar) {
    if (avatar) {
      if (!this.photoAvatar.dataset.buffer) {
        this.photoAvatar.dataset.buffer = this.photoAvatar.src;
      }
      this.photoAvatar.onload = () => URL.revokeObjectURL(this.photoAvatar.src);
      this.photoAvatar.src = URL.createObjectURL(avatar);
    } else {
      this.photoAvatar.src = '';
    }
  }

  originalAvatarFromBuffer() {
    if (this.photoAvatar.dataset.buffer) {
      this.photoAvatar.src = this.photoAvatar.dataset.buffer;
      this.photoAvatar.dataset.buffer = '';
    }
  }

  clearAvatarBuffer() {
    this.photoAvatar.dataset.buffer = '';
  }

  handleProfileAvatarWait(message) {
    replaceClassForEver(this.blockAvatar, ['call-message-wait'], [], this.checker.blockAvatar);
    this.messageAfterAvatar.innerHTML = message;
  }

  handleProfileAvatarError(message) {
    replaceClassForTwoSeconds(this.blockAvatar, ['call-message-error'], [], this.checker.blockAvatar);
    this.messageAfterAvatar.innerHTML = message;
  }

  handleProfileAvatarSuccess(message) {
    replaceClassForTwoSeconds(this.blockAvatar, ['call-message-success'], [], this.checker.blockAvatar);
    this.messageAfterAvatar.innerHTML = message;
  }

  handleProfileFormWait(message) {
    replaceTextboxClassAndMessageForEver(this.textboxRepeatPassword, 'wait', this.checker.textboxRepeatPassword);
    this.messageAfterRepeatPassword.innerHTML = message;
  }

  handleProfileFormError(message) {
    replaceClassForSecond(this.textboxRepeatPassword,
      [], [], this.checker.textboxRepeatPassword);
    switch (message) {
      case ProfileMessage.emailErrorValidation:
      case ProfileMessage.emailNonUniq:
        replaceTextboxClassAndMessageForTwoSeconds(this.textboxEmail, 'error', this.checker.textboxEmail);
        this.messageAfterEmail.innerHTML = message;
        break;
      case ProfileMessage.usernameErrorValidation:
      case ProfileMessage.usernameErrorServer:
        replaceTextboxClassAndMessageForTwoSeconds(this.textboxUserName, 'error', this.checker.textboxUserName);
        this.messageAfterUsername.innerHTML = message;
        break;
      case ProfileMessage.passwordErrorValidation:
        replaceTextboxClassAndMessageForTwoSeconds(this.textboxPassword, 'error', this.checker.textboxPassword);
        this.messageAfterPassword.innerHTML = message;
        break;
      case ProfileMessage.repeatPasswordErrorValidation:
      default:
        replaceTextboxClassAndMessageForTwoSeconds(this.textboxRepeatPassword, 'error', this.checker.textboxRepeatPassword);
        this.messageAfterRepeatPassword.innerHTML = message;
        break;
    }
  }

  handleProfileFormSuccess(message) {
    replaceTextboxClassForTwoSeconds(this.textboxEmail, 'success', this.checker.textboxEmail);
    replaceTextboxClassForTwoSeconds(this.textboxUserName, 'success', this.checker.textboxUserName);
    replaceTextboxClassForTwoSeconds(this.textboxPassword, 'success', this.checker.textboxPassword);
    replaceTextboxClassAndMessageForTwoSeconds(this.textboxRepeatPassword, 'success', this.checker.textboxRepeatPassword);
    this.messageAfterRepeatPassword.innerText = message;
  }
}
