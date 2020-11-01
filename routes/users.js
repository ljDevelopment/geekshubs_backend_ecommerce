var express = require('express');
var router = express.Router();

const UsersController = require('../controllers/UsersController');

router.get('/', UsersController.getData);
router.put('/', UsersController.getData);
router.post('/login', UsersController.login);
router.put('/signup', UsersController.signup);

module.exports = router;
