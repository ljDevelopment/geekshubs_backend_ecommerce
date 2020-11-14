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


ProductsController.delete = (req, res, next) => {

	const id = util.getFieldFromRequest(req, 'id');
	const token = util.getFieldFromRequest(req, 'token');

	Product.erase({ _id : id, token})
		.then(p => res.json(p))
		.catch(err => res.status(401).json({err : err}));	
}

ProductsController.modify = (req, res, next) => {

	const { id } = req.params;
	const { body } = req;	
	const { query } = req;

	Product.updateById({ id : id, ...body, ...query })
		.then(u => res.json(u))
		.catch(err => res.status(401).json({err : err}));	
}

ProductsController.list = (req, res) => {

	Product.list()
		.then(p => res.json(p))
		.catch(err => res.status(401).json({err : err}));	
}

module.exports = ProductsController;