import EventBus from '../utils/eventBus.js';
import LoginModel from './loginModel.js';
import LoginView from './loginView.js';
import LoginEvents from './loginEvents.js';

export default class LoginController {
  /**
   * @param router {!Router}
   * @param root {!HTMLElement}
   * @return {!LoginModule}
   */
  constructor(router, root) {
    this.root = root;
    this.eventBus = new EventBus();
    this.eventBus.subscribe(LoginEvents.profile, (profile) => router.go('/profile', profile));
    this.eventBus.subscribe(LoginEvents.registration, (profile) => router.go('/registration', profile));
    this.model = new LoginModel(this.eventBus);
    this.view = new LoginView(this.eventBus);
  }

  start() {
    this.view.render(this.root);
  }
}
