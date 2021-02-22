import './registration.handlebars.js';
import ValidationModule from '../validation/validation.js';

export default class RegistrationModule {
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
    if (ValidationModule.correctLoginProfile(data)) {
      return false;
    }
    window.history.pushState({ urlPath: window.location.pathname }, null, '/registration');
    // eslint-disable-next-line no-undef
    this.root.innerHTML = Handlebars.templates.registration(data);

    const inputEmail = document.getElementById('e-mail');
    const inputUserName = document.getElementById('username');
    const inputPassword = document.getElementById('password');
    const inputRepeatPassword = document.getElementById('repeat-password');
    const buttonEnter = document.getElementById('enter');
    const buttonGotoLogin = document.getElementById('goto-login');

    const allFocusElem = [
      { elem: inputEmail, script: () => buttonEnter.click() },
      { elem: inputUserName, script: () => buttonEnter.click() },
      { elem: inputPassword, script: () => buttonEnter.click() },
      { elem: inputRepeatPassword, script: () => buttonEnter.click() },
      { elem: buttonEnter, script: () => buttonEnter.click() },
      { elem: buttonGotoLogin, script: () => buttonGotoLogin.click() },
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

    buttonEnter.addEventListener('click', () => {
      // console.log(inputEmail.parentElement);
      // inputEmail.parentElement.style = 'color:green';
      data.email = inputEmail.value;
      data.username = inputUserName.value;
      data.password = inputPassword.value;
      this.router.call('/profile')();
    });

    buttonGotoLogin.addEventListener('click', () => {
      this.router.call('/login')();
    });

    return true;
  }
}
