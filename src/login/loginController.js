import EventBus from '../utils/eventBus.js';
import LoginModel from './loginModel.js';
import LoginView from './loginView.js';
import { LoginEvents } from './loginEvents.js';
import { ConstantEventsString } from '../constants.js';

export default class LoginController {
  /**
   * @param router {!Router}
   * @param root {!HTMLElement}
   * @return {!LoginModule}
   */
  constructor(router, root) {
    this.root = root;
    this.eventBus = new EventBus();
    this.eventBus.subscribe(LoginEvents.mainPage, () => router.go(ConstantEventsString.main));
    this.eventBus.subscribe(LoginEvents.registration,
      () => router.go(ConstantEventsString.registration));
    this.model = new LoginModel(this.eventBus);
    this.view = new LoginView(this.eventBus, root);
  }

  start() {
    this.model.checkAuthorization();
  }
}
