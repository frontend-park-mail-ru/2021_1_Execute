import LoginController from './login/loginController.js';
import ProfileController from './profile/profileController.js';
import RegistrationController from './registration/registrationController.js';
import Router from './utils/router.js';

const root = document.getElementById('root');
const router = new Router();

const loginController = new LoginController(router, root);
const profileController = new ProfileController(router, root);
const registrationController = new RegistrationController(router, root);

router.addRoute('/', () => router.go('login'));
router.addRoute('login', () => loginController.start());
router.addRoute('registration', () => registrationController.start());
router.addRoute('profile', () => profileController.start());

router.go(window.location.pathname);
window.onpopstate = () => router.routes.call(window.location.pathname);
