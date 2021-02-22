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
    if (profile.email && profile.email.match('^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[*.!@$%^&(){}[]:;<>,.?/~_+-=|]).{8,32}$') !== null) {
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
      const bigData = [
        {
          username: 'ZhukDima', password: '123456', photo: '/img/32.jpg', email: 'zhukdo@gmail.com',
        },
        {
          username: 'SkalikS', password: '654321', photo: '/img/35.jpg', email: 'zhukdo@yandex.ru',
        },
      ];
      // eslint-disable-next-line no-console
      console.log('Server ask', _profile);
      const idealProfile = bigData.find(({ username, password }) => _profile.username === username
        && _profile.password === password);
      // eslint-disable-next-line no-console
      console.log('Server ans', idealProfile);
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
