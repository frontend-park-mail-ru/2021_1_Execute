import './registration.handlebars.js';
import TemporaryReplacement from '../utils/temporaryReplacement.js';
import ValidationModule from '../validation/validation.js';

export default class RegistrationView {
  /**
   * @param {!EventBus}
   * @return {!RegistrationView}
   */
  constructor(eventBus, profile) {
    this.eventBus = eventBus;
    this.profile = profile;
  }

  render(root) {
    // eslint-disable-next-line no-undef
    root.innerHTML = Handlebars.templates.registration(this.profile);
    this.addEventListeners();
  }

  addEventListeners() {
    const inputEMail = document.getElementById('e-mail');
    const inputUserName = document.getElementById('username');
    const inputPassword = document.getElementById('password');
    const inputRepeatPassword = document.getElementById('repeat-password');
    const buttonEnter = document.getElementById('enter');
    const buttonGotoLogin = document.getElementById('goto-login');

    buttonEnter.addEventListener('click', () => this.eventBus.call('clickEnter',
      inputEMail.value, inputUserName.value, inputPassword.value, inputRepeatPassword.value));

    buttonGotoLogin.addEventListener('click', () => this.eventBus.call('clickGotoLogin'));

    this.eventBus.subscribe('registration-warning', () => {
      if (this.profile.correct_email === ValidationModule.UNCORRECT_PARSE) {
        TemporaryReplacement.forTwoSeconds(inputEMail.parentElement.style, 'color', '#E38C00');
      }
      if (this.profile.correct_username === ValidationModule.UNCORRECT_PARSE) {
        TemporaryReplacement.forTwoSeconds(inputUserName.parentElement.style, 'color', '#E38C00');
      }
      if (this.profile.correct_password === ValidationModule.UNCORRECT_PARSE) {
        TemporaryReplacement.forTwoSeconds(inputPassword.parentElement.style, 'color', '#E38C00');
      }
      if (this.profile.correct_repeatPassword === ValidationModule.UNCORRECT_PARSE) {
        TemporaryReplacement.forTwoSeconds(inputRepeatPassword.parentElement.style, 'color', '#E38C00');
      }
      TemporaryReplacement.forTwoSeconds(buttonEnter, 'className', 'menu-btn menu-btn-orange menu-btn-active-orange');
      TemporaryReplacement.forTwoSeconds(buttonEnter, 'innerText', 'Некорректные данные');
    });

    this.eventBus.subscribe('registration-error', () => {
      if (this.profile.correct_email === ValidationModule.UNCORRECT_SERVERANS) {
        TemporaryReplacement.forTwoSeconds(inputEMail.parentElement.style, 'color', '#e34a00');
        TemporaryReplacement.forTwoSeconds(buttonEnter, 'innerText', 'Email занят');
      }
      if (this.profile.correct_username === ValidationModule.UNCORRECT_SERVERANS) {
        TemporaryReplacement.forTwoSeconds(inputUserName.parentElement.style, 'color', '#e34a00');
        TemporaryReplacement.forTwoSeconds(buttonEnter, 'innerText', 'Имя занято');
      }
      TemporaryReplacement.forTwoSeconds(buttonEnter, 'className', 'menu-btn menu-btn-red menu-btn-active-red');
    });
  }
}
