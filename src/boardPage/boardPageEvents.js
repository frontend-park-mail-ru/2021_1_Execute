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
  renderNewRow: 'boardPage.view.renderNewRow',
  addToFavorite: 'boardPage.model.addToFavorite',
  clickAddRow: 'boardPage.model.clickAddRow',
  boardError: 'boardPage.view.boardErrorHandler',
  headerError: 'boardPage.view.headerErrorHandler',
};

export const BoardPageMessage = {
  unknownError: {
    title: 'Неизвестная ошибка',
    message: 'Господи, Спаси и Сохрани\nСтатус: ',
  },
  userUndefined: {
    title: 'Пользователь не найден',
    message: 'Как ты вообще эту ошибку сгенерил? Топай логиниться',
  },
  urlBrake: {
    title: 'URL поврежден',
    message: 'Эта ссылка недействительна. Если вы получили ее от другого пользователя, '
      + 'попросите его проверить адрес еще раз.',
  },
};
