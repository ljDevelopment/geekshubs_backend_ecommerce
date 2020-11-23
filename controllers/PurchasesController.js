const Purchase = require('../model/Purchase');
const util = require('../src/util');

const PurchasesController = {};


PurchasesController.new =  (req, res) => {

	const { body } = req;
	const token = util.getFieldFromRequest(req, 'token');
	
	Purchase.new({ data : body, token })
		.then(product => { res.json(product); })
		.catch(err => { 
			let status = (err.code == 11000)
							? 412
							: err.code;
			res.status(status || 400).json({ err : err });
		});
}


PurchasesController.modify = (req, res, next) => {

	const { id } = req.params;
	const { body } = req;	
	const token = util.getFieldFromRequest(req, 'token');

	Purchase.updateById({ id : id, ...body, token})
		.then(u => res.json(u))
		.catch(err => res.status(err.code || 400).json({err : err}));	
}

PurchasesController.list = (req, res) => {

	const token = util.getFieldFromRequest(req, 'token');
	const { body } = req;
	const groupBy = util.getFieldFromRequest(req, 'groupBy');

	Purchase.list(token,body, groupBy)
		.then(p => res.json(p))
		.catch(err => res.status(err.code || 400).json({err : err}));	
}

module.exports = PurchasesController;