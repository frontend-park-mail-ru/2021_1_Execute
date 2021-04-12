import EventBus from '../utils/eventBus.js';
import ProfileModel from './profileModel.js';
import ProfileView from './profileView.js';
import { ProfileEvent } from './profileEvents.js';
import { ConstantEventsString } from '../constants.js';

export default class ProfileController {
  /**
   * @param router {!Router}
   * @param root {!HTMLElement}
   * @return {!ProfileController}
   */
  constructor(router, root) {
    this.root = root;
    this.eventBus = new EventBus();
    this.eventBus.subscribe(ProfileEvent.login, () => router.go(ConstantEventsString.login));
    this.model = new ProfileModel(this.eventBus);
    this.view = new ProfileView(this.eventBus, this.root);
  }

  start() {
    this.eventBus.call(ProfileEvent.getData);
  }
}
