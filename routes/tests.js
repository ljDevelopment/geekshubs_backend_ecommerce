var express = require('express');
var router = express.Router();

const TestsController = require('../controllers/TestsController');

router.get('/', TestsController.base)
router.get('/cleandb', TestsController.cleandb);

module.exports = router;
