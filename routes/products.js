var express = require('express');
var router = express.Router();

const ProductsController = require('../controllers/ProductsController');

router.get('/', ProductsController.list);
router.post('/', ProductsController.new);
router.delete('/:id', ProductsController.delete);
router.put('/:id', ProductsController.modify);

module.exports = router;
