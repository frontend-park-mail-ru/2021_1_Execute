export const RegistrationEvents = {
  clickEnter: 'registration.model.clickEnter',
  registrationError: 'registration.view.registrationError',
  registrationWait: 'registration.view.registrationWait',
  profile: 'profile.controller.start',
  login: 'login.controller.start',
};

export const RegistrationMessage = {
  waitData: 'Ожидаем ответ от сервера',
  emailErrorValidation: 'Почта не корректна',
  usernameErrorValidation: 'Некорректное имя пользователя (Буквы, цифры, >3)',
  passwordErrorValidation: 'Пароль не корректный',
  repeatPasswordErrorValidation: 'Пароли не совпали',
  emailNonUniq: 'Пользователь с такой почтой уже есть',
  errorValidation: 'Некорректные данные',
  unknownError: 'Неизвестная ошибка',
};
