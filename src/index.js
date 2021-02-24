import LoginController from './login/loginController.js';
import Router from './utils/router.js';

const root = document.getElementById('root');
const router = new Router();
const profile = {};

const loginController = new LoginController(router, root);

router.addRoute('/', () => router.go('/login', profile));
router.addRoute('/login', () => loginController.start(profile));

router.go(window.location.pathname);
