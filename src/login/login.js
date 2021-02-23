import './login.handlebars.js';
import ValidationModule from '../validation/validation.js';

export default class LoginModule {
  /**
   * @param router {!Router}
   * @param root {!HTMLElement}
   * @return {!LoginModule}
   */
  constructor(router, root) {
    this.router = router;
    this.root = root;
  }

  /**
   * Render site by data
   */
  render(data) {
    ValidationModule.exitProfile(data);
    window.history.pushState({ urlPath: window.location.pathname }, null, '/login');
    // eslint-disable-next-line no-undef
    this.root.innerHTML = Handlebars.templates.login(data);

    const inputUserName = document.getElementById('username');
    const inputPassword = document.getElementById('password');
    const buttonEnter = document.getElementById('enter');
    const buttonGotoRegistration = document.getElementById('goto-registration');

    const allFocusElem = [
      { elem: inputUserName, script: () => buttonEnter.click() },
      { elem: inputPassword, script: () => buttonEnter.click() },
      { elem: buttonEnter, script: () => buttonEnter.click() },
      { elem: buttonGotoRegistration, script: () => buttonGotoRegistration.click() },
    ];

    const changeFocus = (index) => (event) => {
      switch (event.code) {
        case 'Enter':
          event.preventDefault();
          allFocusElem[index].script();
          break;
        case 'ArrowUp':
          event.preventDefault();
          if (index > 0) {
            allFocusElem[index - 1].elem.focus();
          }
          break;
        case 'ArrowDown':
          event.preventDefault();
          if (index < allFocusElem.length - 1) {
            allFocusElem[index + 1].elem.focus();
          }
          break;
        default:
      }
    };

    allFocusElem.forEach(({ elem }, index) => elem.addEventListener('keydown', changeFocus(index)));
    allFocusElem[0].elem.focus();

    inputUserName.dataset.numtimeout = 0;
    inputPassword.dataset.numtimeout = 0;

    buttonEnter.addEventListener('click', () => {
      data.username = inputUserName.value;
      data.password = inputPassword.value;
      if (!this.router.call('/profile')()) {
        inputUserName.parentElement.style = 'color:red';
        inputPassword.parentElement.style = 'color:red';

        inputUserName.dataset.numtimeout -= -1;
        inputPassword.dataset.numtimeout -= -1;
        setTimeout(() => {
          inputUserName.dataset.numtimeout -= 1;
          inputPassword.dataset.numtimeout -= 1;
          if (inputUserName.dataset.numtimeout === '0') {
            inputUserName.parentElement.style = '';
            inputPassword.parentElement.style = '';
          }
        }, 2 * 1000);
      }
    });

    buttonGotoRegistration.addEventListener('click', () => {
      this.router.call('/registration')();
    });

    return true;
  }
}
