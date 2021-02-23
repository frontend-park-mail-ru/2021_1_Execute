import ValidationModule from '../validation/validation.js';
import EventBus from '../utils/eventBus.js';
import RegistrationModel from './registrationModel.js';
import RegistrationView from './registrationView.js';

export default class RegistrationController {
  /**
   * @param router {!Router}
   * @param root {!HTMLElement}
   * @return {!RegistrationController}
   */
  constructor(router, root) {
    this.root = root;
    this.eventBus = new EventBus();
    this.eventBus.subscribe('login', () => router.go('/login'));
    this.eventBus.subscribe('profile', () => router.go('/profile'));
  }

  start(profile) {
    ValidationModule.exitProfile(profile);

    this.model = new RegistrationModel(this.eventBus, profile);
    this.view = new RegistrationView(this.eventBus, profile);
    this.view.render(this.root);

    return true;
  }
}
