import LoginController from './login/loginController.js';
import ProfileController from './profile/profileController.js';
import Router from './utils/router.js';

const root = document.getElementById('root');
const router = new Router();

const loginController = new LoginController(router, root);
const profileController = new ProfileController(router, root);

router.addRoute('/', () => router.go('login'));
router.addRoute('login', () => loginController.start());
router.addRoute('registation', () => {});
router.addRoute('profile', (profile) => profileController.start(profile));

router.go(window.location.pathname);
