import { correctChangeProfile } from '../utils/validationModule.js';
import {
  profilePatchForm, profileGetForm, waitAnsFromServer,
} from '../utils/requestToServer.js';
import { ProfileEvent } from './profileEvents.js';

export default class ProfileModel {
  /**
   * @param {!EventBus}
   * @return {!ProfileModel}
   */
  constructor(eventBus) {
    this.eventBus = eventBus;
    this.eventBus.subscribe(ProfileEvent.getData, () => this.getData());
    this.eventBus.subscribe(ProfileEvent.clickChangeData, (profile) => this.changeData(profile));
  }

  getData() {
    //console.log(getCookie('id'));
    profileGetForm()
    .then((resp) => {
      switch (resp.status) {
        case 200:
          const data = resp.body
          console.log(data);
          this.eventBus.call(ProfileEvent.renderData, data);
          break;
        case 401:
          this.eventBus.call(ProfileEvent.profileError, {message: 'Неавторизованный запрос'});
          break;
        case 404:
          this.eventBus.call(ProfileEvent.profileError, {message: 'Пользователь не найден'});
          break;
        default:
          this.eventBus.call(ProfileEvent.profileError, {message: 'Неизвестная ошибка'});
      }
    })
    // waitAnsFromServer(profileGetForm(),
    //   (message) => this.eventBus.call(ProfileEvent.profileError, message),
    //   (val) => this.eventBus.call(ProfileEvent.profileSuccess, val.user));
  }

  changeData(profile) {
    const callError = (message) => this.eventBus.call(ProfileEvent.profileError, message);
    if (correctChangeProfile(profile, callError)) {
      waitAnsFromServer(profilePatchForm(profile),
        callError,
        (val) => this.eventBus.call(ProfileEvent.profileSuccess, val));
    }
  }
}
