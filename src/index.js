import LoginController from './login/loginController.js';
import ProfileController from './profile/profileController.js';
import RegistrationController from './registration/registrationController.js';
import BoardPageController from './boardPage/boardPageController.js';
import MainPageController from './mainPage/mainPageController.js';
import Router from './utils/router.js';

const root = document.getElementById('root');
const router = new Router();

const loginController = new LoginController(router, root);
const profileController = new ProfileController(router, root);
const registrationController = new RegistrationController(router, root);
const boardPageController = new BoardPageController(router, root);
const mainPageController = new MainPageController(router, root);

router.addRoute('/', (...all) => router.go('main', ...all));
router.addRoute('login', (...all) => loginController.start(...all));
router.addRoute('registration', (...all) => registrationController.start(...all));
router.addRoute('profile', (...all) => profileController.start(...all));
router.addRoute('board', (pathArr, ...data) => boardPageController.start(pathArr, ...data));
router.addRoute('main', (...all) => mainPageController.start(...all));

router.goWithoutHistory(window.location.pathname);
