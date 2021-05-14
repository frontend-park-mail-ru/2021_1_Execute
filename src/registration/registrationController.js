import EventBus from '../utils/eventBus.js';
import RegistrationModel from './registrationModel.js';
import RegistrationView from './registrationView.js';
import { RegistrationEvents } from './registrationEvents.js';
import { ConstantEventsString } from '../constants.js';

export default class RegistrationController {
  /**
   * @param router {!Router}
   * @param root {!HTMLElement}
   * @return {!RegistrationModule}
   */
  constructor(router, root) {
    this.root = root;
    this.eventBus = new EventBus();
    this.eventBus.subscribe(RegistrationEvents.mainPage,
      () => router.go(ConstantEventsString.main));
    this.eventBus.subscribe(RegistrationEvents.login, () => router.go(ConstantEventsString.login));
    this.model = new RegistrationModel(this.eventBus);
    this.view = new RegistrationView(this.eventBus, root);
  }

  start() {
    this.model.checkAuthorization();
  }
}
