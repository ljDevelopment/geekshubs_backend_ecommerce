var express = require('express');
var router = express.Router();

const TestsController = require('../controllers/TestsController');

router.get('/', TestsController.base)
router.get('/cleanUsers', TestsController.cleanUsers);
router.get('/cleanProducts', TestsController.cleanProducts);

module.exports = router;
