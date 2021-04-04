export const BoardPageEvent = {
  getData: 'boardPage.model.getData',
  profile: 'profile.controller.start',
  login: 'login.controller.start',
  renderData: 'boardPage.view.renderData',
  clickButtonBoard: 'boardPage.model.clickButtonTask',
  openSettings: 'boardPage.model.getBoard',
  renderSettings: 'boardPage.model.renderSettings',
  openTask: 'boardPage.model.getTask',
  renderTask: 'boardPage.model.renderTask',
  addToFavorite: 'boardPage.model.addToFavorite',
  boardError: 'boardPage.view.boardErrorHandler',
  headerError: 'boardPage.view.headerErrorHandler',
};

export const BoardPageMessage = {
  success: 'Данные изменены',
  unknownError: 'Неизвестная ошибка',
  userUndefined: 'Пользователь не найден',
};
