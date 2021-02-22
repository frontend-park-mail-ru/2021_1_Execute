import './login.handlebars.js';
import AskerModule from '../asker/asker.js';

class LoginModule {
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
    window.history.pushState({ urlPath: window.location.pathname }, null, '/login');
    // eslint-disable-next-line no-undef
    this.root.innerHTML = Handlebars.templates.login(data);

    const inputUserName = document.getElementById('username');
    const inputPassword = document.getElementById('password');
    const buttonEnter = document.getElementById('enter');
    const buttonGotoRegistration = document.getElementById('goto-registration');

    const allFocusElem = [inputUserName, inputPassword, buttonEnter, buttonGotoRegistration];

    const changeFocus = (index) => (event) => {
      switch (event.code) {
        case 'Enter':
          event.preventDefault();
          buttonEnter.click();
          break;
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

    buttonEnter.addEventListener('click', () => {
      data.username = inputUserName.value;
      data.password = inputPassword.value;
      if (AskerModule.correctLoginProfile(data)) {
        return this.router.call('/profile')();
      }
      return undefined;
    });
  }
}

export { LoginModule as default };
