import LoginController from './login/loginController.js';
import RegistrationController from './registration/registrationController.js';
import Router from './utils/router.js';

const root = document.getElementById('root');
const router = new Router();

const loginController = new LoginController(router, root);
const registrationController = new RegistrationController(router, root);

router.addRoute('/', () => router.go('login'));
router.addRoute('login', () => loginController.start());
router.addRoute('registration', () => registrationController.start());
router.addRoute('profile', () => {});

router.go(window.location.pathname);
