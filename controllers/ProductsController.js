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
			res.status(status || 400).json({ err : err });
		});
}


ProductsController.delete = (req, res, next) => {

	const id = util.getFieldFromRequest(req, 'id');
	const token = util.getFieldFromRequest(req, 'token');

	Product.erase({ _id : id, token})
		.then(p => res.json(p))
		.catch(err => res.status(err.code || 400).json({err : err}));	
}

ProductsController.modify = (req, res, next) => {

	const { id } = req.params;
	const { body } = req;	
	const token = util.getFieldFromRequest(req, 'token');

	Product.updateById({ id : id, ...body, token })
		.then(u => res.json(u))
		.catch(err => res.status(err.code || 400).json({err : err}));	
}

ProductsController.list = (req, res) => {

	const { body } = req;
	const groupBy = util.getFieldFromRequest(req, 'groupBy');

	Product.list(body, groupBy)
		.then(p => res.json(p))
		.catch(err => res.status(err.code || 400).json({err : err}));	
}

module.exports = ProductsController;