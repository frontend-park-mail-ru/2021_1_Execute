import './login.handlebars.js';
import ValidationModule from '../validation/validation.js';
import TemporaryReplacement from '../utils/temporaryReplacement.js';

export default class LoginView {
  /**
   * @param {!EventBus}
   * @return {!LoginView}
   */
  constructor(eventBus, profile) {
    this.eventBus = eventBus;
    this.profile = profile;
  }

  render(root) {
    // eslint-disable-next-line no-undef
    root.innerHTML = Handlebars.templates.login(this.profile);
    this.addEventListeners();
  }

  addEventListeners() {
    const inputUserName = document.getElementById('username');
    const inputPassword = document.getElementById('password');
    const buttonEnter = document.getElementById('enter');
    const buttonGotoRegistration = document.getElementById('goto-registration');

    buttonEnter.addEventListener('click', () => this.eventBus.call('clickEnter', inputUserName.value, inputPassword.value));
    buttonGotoRegistration.addEventListener('click', () => this.eventBus.call('clickGotoRegistration'));

    this.eventBus.subscribe('login-warning', () => {
      if (this.profile.correct_username === ValidationModule.UNCORRECT_PARSE) {
        TemporaryReplacement.forTwoSeconds(inputUserName.parentElement.style, 'color', '#E38C00');
      }
      if (this.profile.correct_password === ValidationModule.UNCORRECT_PARSE) {
        TemporaryReplacement.forTwoSeconds(inputPassword.parentElement.style, 'color', '#E38C00');
      }
      TemporaryReplacement.forTwoSeconds(buttonEnter, 'className', 'menu-btn menu-btn-orange menu-btn-active-orange');
      TemporaryReplacement.forTwoSeconds(buttonEnter, 'innerText', 'Некорректные данные');
    });

    this.eventBus.subscribe('login-error', () => {
      TemporaryReplacement.forTwoSeconds(inputUserName.parentElement.style, 'color', '#e34a00');
      TemporaryReplacement.forTwoSeconds(inputPassword.parentElement.style, 'color', '#e34a00');
      TemporaryReplacement.forTwoSeconds(buttonEnter, 'className', 'menu-btn menu-btn-red menu-btn-active-red');
      TemporaryReplacement.forTwoSeconds(buttonEnter, 'innerText', 'Неверные данные');
    });
  }
}
