import ValidationModule from '../validation/validation.js';
import EventBus from '../utils/eventBus.js';
import ProfileModel from './profileModel.js';
import ProfileView from './profileView.js';

export default class LoginController {
  /**
   * @param router {!Router}
   * @param root {!HTMLElement}
   * @return {!LoginModule}
   */
  constructor(router, root) {
    this.root = root;
    this.eventBus = new EventBus();
    this.eventBus.subscribe('login', () => router.go('/login'));
    this.eventBus.subscribe('registration', () => router.go('/registration'));
  }

  start(profile) {
    if (!ValidationModule.correctLoginProfile(profile)) {
      return false;
    }

    this.model = new ProfileModel(this.eventBus, profile);
    this.view = new ProfileView(this.eventBus, profile);
    this.view.render(this.root);

    return true;
  }
}
