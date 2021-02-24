export default class LoginEvents {
  static get clickEnter() {
    return 'login.view.clickEnter';
  }

  static get clickGoToRegistration() {
    return 'login.view.clickGoToRegistration';
  }

  static get handleLoginWarning() {
    return 'login.model.handleLoginWarning';
  }

  static get handleLoginError() {
    return 'login.model.handleLoginError';
  }

  static get profile() {
    return 'login.controller.profile';
  }

  static get registration() {
    return 'login.controller.registration';
  }
}
