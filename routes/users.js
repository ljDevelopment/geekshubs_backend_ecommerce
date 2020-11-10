var express = require('express');
var router = express.Router();

const UsersController = require('../controllers/UsersController');

router.get('/:id', UsersController.getData);
router.post('/login', UsersController.login);
router.post('/signup', UsersController.signup);

module.exports = router;
