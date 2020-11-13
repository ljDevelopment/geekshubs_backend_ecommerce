var express = require('express');
var router = express.Router();

const ProductsController = require('../controllers/ProductsController');

// router.get('/', ProductsController.get);
// router.delete('/:id', ProductsController.delete);
router.post('/', ProductsController.new);
router.delete('/:id', ProductsController.delete);
// router.put('/:id', ProductsController.update);

module.exports = router;
