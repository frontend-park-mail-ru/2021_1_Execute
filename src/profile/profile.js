import './profile.handlebars.js';
import ValidationModule from '../validation/validation.js';

export default class ProfileModule {
  /**
   * @param router {!Router}
   * @param root {!HTMLElement}
   * @return {!ProfileModule}
   */
  constructor(router, root) {
    this.router = router;
    this.root = root;
  }

  /**
   * Render site by data
   */
  render(data) {
    if (!ValidationModule.correctLoginProfile(data)) {
      return false;
    }
    window.history.pushState({ urlPath: window.location.pathname }, null, '/profile');
    // eslint-disable-next-line no-undef
    this.root.innerHTML = Handlebars.templates.profile(data);

    const inputEMail = document.getElementById('e-mail');
    const inputUserName = document.getElementById('username');
    const inputPassword = document.getElementById('password');
    const inputRepeatPassword = document.getElementById('repeat-password');
    const buttonExit = document.getElementById('exit');
    const buttonChangeData = document.getElementById('change-data');

    const allFocusElem = [inputEMail, inputUserName, inputPassword,
      inputRepeatPassword, buttonExit, buttonChangeData];

    const changeFocus = (index) => (event) => {
      switch (event.code) {
        case 'ArrowUp':
          event.preventDefault();
          if (index > 0) {
            allFocusElem[index - 1].focus();
          }
          break;
        case 'ArrowDown':
          event.preventDefault();
          if (index < allFocusElem.length - 1) {
            allFocusElem[index + 1].focus();
          }
          break;
        default:
      }
    };

    allFocusElem.forEach((elem, index) => elem.addEventListener('keydown', changeFocus(index)));
    allFocusElem[0].focus();

    buttonExit.addEventListener('click', () => this.router.call('/login')());

    buttonChangeData.addEventListener('click', () => {
      if (inputUserName.value !== '' && inputPassword.value !== '') {
        data.username = inputUserName.value;
        // eslint-disable-next-line no-console
        console.log('Change approved');
      }
      return undefined;
    });

    return true;
  }
}
