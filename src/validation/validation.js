const bigData = [
  {
    username: 'ZhukDima', password: '123456', photo: '/img/32.jpg', email: 'zhukdo@gmail.com',
  },
  {
    username: 'SkalikS', password: '654321', photo: '/img/35.jpg', email: 'zhukdo@yandex.ru',
  },
];

export default class ValidationModule {
  static get UNCORRECT_PARSE() {
    return -1;
  }

  static get CORRECT_PARSE() {
    return 1;
  }

  static get UNCORRECT_SERVERANS() {
    return -2;
  }

  static get CORRECT_SERVERANS() {
    return 2;
  }

  /**
   * Проверка корректности строки как имени пользователя
   * @param profile
   * @return {boolean}
   */
  static correctUserName(profile) {
    if (profile.username && profile.username.match('^[A-Za-z0-9]+.{6,16}$') !== null) {
      profile.correct_username = this.CORRECT_PARSE;
      return true;
    }
    profile.correct_username = this.UNCORRECT_PARSE;
    return false;
  }

  /**
   * Проверка корректности строки как e-mail
   * @param profile
   * @return {boolean}
   */
  static correctEmail(profile) {
    if (profile.email && profile.email.match(/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/) !== null) {
      profile.correct_email = this.CORRECT_PARSE;
      return true;
    }
    profile.correct_email = this.UNCORRECT_PARSE;
    return false;
  }

  /**
   * Проверка корректности строки как пароля
   * @param profile
   * @return {boolean}
   */
  static correctPassword(profile) {
    if (profile.password && profile.password.match('.{6,16}$') !== null) {
      profile.correct_password = this.CORRECT_PARSE;
      return true;
    }
    profile.correct_password = this.UNCORRECT_PARSE;
    return false;
  }

  /**
   * Принудительный выход пользователя
   * @param profile
   */
  static exitProfile(profile) {
    profile.validate = this.UNCORRECT_SERVERANS;
  }

  /**
   * Проверка корректности (и подкачка) данных пользователя при логине
   * @param profile
   * @return {boolean}
   */
  static correctLoginProfile(profile) {
    if (profile.validate === this.CORRECT_SERVERANS) {
      return true;
    }
    this.correctUserName(profile);
    this.correctPassword(profile);
    if (!(profile.correct_username === this.CORRECT_PARSE
      && profile.correct_password === this.CORRECT_PARSE)) {
      profile.validate = this.UNCORRECT_PARSE;
      return false;
    }

    // Пусть тут запрос к серверу
    const askServer = (_profile) => {
      // eslint-disable-next-line no-console
      console.log('Server ask: login:', _profile);
      const idealProfile = bigData.find(({ username, password }) => _profile.username === username
        && _profile.password === password);
      // eslint-disable-next-line no-console
      console.log('Server ans:', idealProfile);
      return idealProfile;
    };

    const idealProfile = askServer(profile);
    if (idealProfile !== undefined) {
      Object.entries(idealProfile).forEach(([key, value]) => {
        profile[key] = value;
      });
      profile.validate = this.CORRECT_SERVERANS;
      return true;
    }
    profile.validate = this.UNCORRECT_SERVERANS;
    return false;
  }

  /**
   * Проверка корректности (и закачка) данных пользователя при изменении данных
   * @param profile
   * @return {boolean}
   */
  static correctChangeProfile(profile, newProfile) {
    if (profile.validate === this.UNCORRECT_SERVERANS) {
      return false;
    }
    this.correctUserName(newProfile);
    this.correctPassword(newProfile);
    newProfile.correct_repeatPassword = (newProfile.correct_password === this.CORRECT_PARSE
      && newProfile.password === newProfile.repeatPassword)
      ? this.CORRECT_PARSE : this.UNCORRECT_PARSE;
    newProfile.correct_email = (profile.email === newProfile.email)
      ? this.CORRECT_PARSE : this.UNCORRECT_PARSE;

    if (!(newProfile.correct_username === this.CORRECT_PARSE
      && newProfile.correct_password === this.CORRECT_PARSE
      && newProfile.correct_email === this.CORRECT_PARSE
      && newProfile.correct_repeatPassword === this.CORRECT_PARSE)) {
      newProfile.validate = this.UNCORRECT_PARSE;
      return false;
    }

    // Пусть тут запрос к серверу
    const askServer = (_profile, _newProfile) => {
      let idealProfile;
      // eslint-disable-next-line no-console
      console.log('Server ask: change:', _profile, _newProfile);
      if (bigData.some((elem) => _profile.email === elem.email
        && _profile.password === elem.password && _profile.username === elem.username)
        && !bigData.some((elem) => _newProfile.username === elem.username
          && elem.email !== _newProfile.email)) {
        idealProfile = _newProfile;
      }
      // eslint-disable-next-line no-console
      console.log('Server ans:', idealProfile);
      return idealProfile;
    };

    const idealProfile = askServer(profile, newProfile);
    if (idealProfile !== undefined) {
      Object.entries(idealProfile).forEach(([key, value]) => {
        profile[key] = value;
      });
      profile.validate = this.CORRECT_SERVERANS;
      return true;
    }
    profile.validate = this.UNCORRECT_SERVERANS;
    return false;
  }

  /**
   * Проверка корректности (и закачка) данных пользователя при регистрации
   * @param profile
   * @return {boolean}
   */
  static correctCreateProfile(profile) {
    if (profile.validate === this.CORRECT_SERVERANS) {
      return false;
    }
    this.correctEmail(profile);
    this.correctUserName(profile);
    this.correctPassword(profile);
    profile.correct_repeatPassword = (profile.correct_password === this.CORRECT_PARSE
      && profile.password === profile.repeatPassword)
      ? this.CORRECT_PARSE : this.UNCORRECT_PARSE;
    if (!(profile.correct_username === this.CORRECT_PARSE
      && profile.correct_email === this.CORRECT_PARSE
      && profile.correct_password === this.CORRECT_PARSE
      && profile.correct_repeatPassword === this.CORRECT_PARSE)) {
      profile.validate = this.UNCORRECT_PARSE;
      return false;
    }

    // Пусть тут запрос к серверу
    const askServer = (_profile) => {
      let idealProfile;
      // eslint-disable-next-line no-console
      console.log('Server ask: create:', _profile);
      if (bigData.some((elem) => _profile.email === elem.email)) {
        _profile.correct_email = this.UNCORRECT_SERVERANS;
      } else if (bigData.some((elem) => _profile.username === elem.username)) {
        _profile.correct_username = this.UNCORRECT_SERVERANS;
      } else {
        _profile.photo = '/img/not-available.png';
        idealProfile = _profile;
      }
      // eslint-disable-next-line no-console
      console.log('Server ans:', idealProfile);
      return idealProfile;
    };

    const idealProfile = askServer(profile);
    if (idealProfile !== undefined) {
      Object.entries(idealProfile).forEach(([key, value]) => {
        profile[key] = value;
      });
      profile.validate = this.CORRECT_SERVERANS;
      return true;
    }
    profile.validate = this.UNCORRECT_SERVERANS;
    return false;
  }
}
