import LoginController from './login/loginController.js';
import ProfileController from './profile/profileController.js';
import RegistrationController from './registration/registrationController.js';
import BoardPageController from './boardPage/boardPageController.js';
import MainPageController from './mainPage/mainPageController.js';
import Router from './utils/router.js';
import { ConstantEvents } from './constants.js';

const root = document.getElementById('root');
const router = new Router();

const loginController = new LoginController(router, root);
const profileController = new ProfileController(router, root);
const registrationController = new RegistrationController(router, root);
const boardPageController = new BoardPageController(router, root);
const mainPageController = new MainPageController(router, root);

router.addRoute(ConstantEvents.root, () => router.go(ConstantEvents.main));
router.addRoute(ConstantEvents.login, () => loginController.start());
router.addRoute(ConstantEvents.registration, () => registrationController.start());
router.addRoute(ConstantEvents.profile, () => profileController.start());
router.addRoute(ConstantEvents.board, ({ groups }) => boardPageController.start(+groups?.boardId));
router.addRoute(ConstantEvents.main, () => mainPageController.start());

router.goWithoutHistory(window.location.pathname);

window.onpopstate = () => router.goWithoutHistory(window.location.pathname);
