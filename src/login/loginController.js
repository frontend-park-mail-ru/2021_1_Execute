import ValidationModule from '../validation/validation.js';
import EventBus from '../utils/eventBus.js';
import LoginModel from './loginModel.js';
import LoginView from './loginView.js';

export default class LoginController {
  /**
   * @param router {!Router}
   * @param root {!HTMLElement}
   * @return {!LoginModule}
   */
  constructor(router, root) {
    this.root = root;
    this.eventBus = new EventBus();
    this.eventBus.subscribe('profile', () => router.go('/profile'));
    this.eventBus.subscribe('registration', () => router.go('/registration'));
  }

  start(profile) {
    ValidationModule.exitProfile(profile);

    this.model = new LoginModel(this.eventBus, profile);
    this.view = new LoginView(this.eventBus, profile);
    this.view.render(this.root);

    return true;
  }
}
