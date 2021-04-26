import './css/reset.css';
import './css/menu.css';
import './css/header.css';
import LoginController from './login/loginController.js';
import ProfileController from './profile/profileController.js';
import RegistrationController from './registration/registrationController.js';
import BoardPageController from './boardPage/boardPageController.js';
import MainPageController from './mainPage/mainPageController.js';
import Router from './utils/router.js';
import { ConstantEventsString, ConstantEventsRegExp } from './constants.js';
import './css/final.css';

const root = document.getElementById('root');
const router = new Router();

const loginController = new LoginController(router, root);
const profileController = new ProfileController(router, root);
const registrationController = new RegistrationController(router, root);
const boardPageController = new BoardPageController(router, root);
const mainPageController = new MainPageController(router, root);

router.addRoute(ConstantEventsRegExp.root, () => router.go(ConstantEventsString.main));
router.addRoute(ConstantEventsRegExp.login, () => loginController.start());
router.addRoute(ConstantEventsRegExp.registration, () => registrationController.start());
router.addRoute(ConstantEventsRegExp.profile, () => profileController.start());
router.addRoute(ConstantEventsRegExp.board,
  ({ groups }) => boardPageController.start(+groups?.boardId));
router.addRoute(ConstantEventsRegExp.main, () => mainPageController.start());

router.goWithoutHistory(window.location.pathname);

window.onpopstate = () => router.goWithoutHistory(window.location.pathname);
