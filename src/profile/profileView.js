import './profile.handlebars.js';
import TemporaryReplacement from '../utils/temporaryReplacement.js';
import ValidationModule from '../validation/validation.js';

export default class ProfileView {
  /**
   * @param {!EventBus}
   * @return {!ProfileView}
   */
  constructor(eventBus, profile) {
    this.eventBus = eventBus;
    this.profile = profile;
  }

  render(root) {
    // eslint-disable-next-line no-undef
    root.innerHTML = Handlebars.templates.profile(this.profile);
    this.addEventListeners();
  }

  addEventListeners() {
    const inputEMail = document.getElementById('e-mail');
    const inputUserName = document.getElementById('username');
    const inputPassword = document.getElementById('password');
    const inputRepeatPassword = document.getElementById('repeat-password');
    const buttonExit = document.getElementById('exit');
    const buttonChangeData = document.getElementById('change-data');

    buttonExit.addEventListener('click', () => this.eventBus.call('clickExit'));

    buttonChangeData.addEventListener('click', () => {
      this.eventBus.call('clickChangeData',
        inputEMail.value, inputUserName.value, inputPassword.value, inputRepeatPassword.value);
    });

    this.eventBus.subscribe('profile-success', () => {
      TemporaryReplacement.forTwoSeconds(inputUserName.parentElement.style, 'color', '#009863');
      TemporaryReplacement.forTwoSeconds(buttonChangeData, 'className', 'menu-linebtn menu-linebtn-green');
      TemporaryReplacement.forTwoSeconds(buttonChangeData, 'innerText', 'Имя изменяно');
    });

    this.eventBus.subscribe('profile-warning', (newProfile) => {
      if (newProfile.correct_email === ValidationModule.UNCORRECT_PARSE) {
        TemporaryReplacement.forTwoSeconds(inputEMail.parentElement.style, 'color', '#E38C00');
      }
      if (newProfile.correct_username === ValidationModule.UNCORRECT_PARSE) {
        TemporaryReplacement.forTwoSeconds(inputUserName.parentElement.style, 'color', '#E38C00');
      }
      if (newProfile.correct_password === ValidationModule.UNCORRECT_PARSE) {
        TemporaryReplacement.forTwoSeconds(inputPassword.parentElement.style, 'color', '#E38C00');
      }
      if (newProfile.correct_repeatPassword === ValidationModule.UNCORRECT_PARSE) {
        TemporaryReplacement.forTwoSeconds(inputRepeatPassword.parentElement.style, 'color', '#E38C00');
      }
      TemporaryReplacement.forTwoSeconds(buttonChangeData, 'className', 'menu-linebtn menu-linebtn-orange');
      TemporaryReplacement.forTwoSeconds(buttonChangeData, 'innerText', 'Некорректные данные');
    });

    this.eventBus.subscribe('profile-error', () => {
      TemporaryReplacement.forTwoSeconds(inputUserName.parentElement.style, 'color', '#e34a00');
      TemporaryReplacement.forTwoSeconds(buttonChangeData, 'className', 'menu-linebtn menu-linebtn-red');
      TemporaryReplacement.forTwoSeconds(buttonChangeData, 'innerText', 'Имя занято');
    });
  }
}
