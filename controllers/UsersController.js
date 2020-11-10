const { json } = require("express");
const User = require('../model/User');
const SHA256 = require("crypto-js/sha256");
const Base64 = require('crypto-js/enc-base64');

const UsersController = {};


UsersController.login = (req, res, next) => {

	const { body } = req;

	if (field = validateFields(
		body,
		['email', 'password'],
	))
	{
		return res.status(400).json({err : `Needed field: ${field}`});
	}	

	body.password = Base64.stringify(SHA256(body.password));

	User.findByCredentials(
		body
	)
	.then(u => res.json(u))
	.catch(err => res.status(401).json({err : err}));
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

	const { id } = req.params;
	
	User.get(id)
		.then(u => res.json(u))
		.catch(err => res.status(401).json({err : err}));
}


UsersController.update = (req, res, next) => {

	const { id } = req.params;
	const { body } = req;	

	User.updateById({_id : id, ...body})
		.then(u => res.json(u))
		.catch(err => res.status(401).json({err : err}));	
}



function validateFields(fields, expected) {

	for (let i = 0; i < expected.length; ++i) {

		let field = expected[i];
		
		if (!fields[field]) {
			return field;
		}
	}
}

module.exports = UsersController;