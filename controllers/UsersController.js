const { json } = require("express");
const User = require('../model/User');
const util = require('../src/util');

const UsersController = {};


UsersController.login = (req, res, next) => {

	const { body } = req;

	User.findByCredentials(
		body
	)
	.then(async u => {

		u.token = util.generateAuthToken(u); 
		res.json(u);
	})
	.catch(err => res.status(err.code).json({err : err}));
}


UsersController.signup = (req, res) => {

	const { body } = req;
	
	User.new(body)
		.then(user => { res.json(user); })
		.catch(err => { 
			let status = (err.code == 11000)
							? 412
							: err.code;
			res.status(status).json({ err : err });
		});
}


UsersController.getData = (req, res, next) => {

	const id = util.getFieldFromRequest(req, 'id');
	const token = util.getFieldFromRequest(req, 'token');
	
	User.get({ id, token})
		.then(u => { 
			res.json(u);
		})
		.catch(err => res.status(err.code).json({err : err}))
}


UsersController.update = (req, res, next) => {

	const { id } = req.params;
	const { body } = req;
	const token = util.getFieldFromRequest(req, 'token');

	User.updateById({ id : id, ...body, token })
		.then(u => res.json(u))
		.catch(err => res.status(err.code ? err.code : 401).json({err : err}));	
}



module.exports = UsersController;