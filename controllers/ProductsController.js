const Product = require('../model/Product');
const util = require('../src/util');

const ProductsController = {};


ProductsController.new =  (req, res) => {

	const { body } = req;
	const token = util.getFieldFromRequest(req, 'token');
	
	Product.new({ data : body, token })
		.then(product => { res.json(product); })
		.catch(err => { 
			let status = (err.code == 11000)
							? 412
							: err.code;
			res.status(status).json({ err : err });
		});
}


module.exports = ProductsController;