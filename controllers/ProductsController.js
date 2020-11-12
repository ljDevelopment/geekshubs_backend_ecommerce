const Product = require('../model/Product');

const ProductsController = {};


ProductsController.new =  (req, res) => {

	const { body } = req;
	
	Product.new(body)
		.then(product => { res.json(product); })
		.catch(err => { 
			let status = (err.code == 11000)
							? 412
							: err.code;
			res.status(status).json({ err : err });
		});
}


module.exports = ProductsController;