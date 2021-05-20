const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController')
const custom_middleware = require('../customMiddleware')


/* GET users listing. */
router.get('/login', custom_middleware.checkJwt, userController.get_login_form)

router.post('/login', userController.post_login_form)

router.get('/register', userController.get_register_form)

router.post('/register', userController.post_register_form)

module.exports = router;
