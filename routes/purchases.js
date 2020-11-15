var express = require('express');
var router = express.Router();

const PurchasesController = require('../controllers/PurchasesController');

router.get('/', PurchasesController.list);
router.post('/', PurchasesController.new);
router.put('/:id', PurchasesController.modify);

module.exports = router;
