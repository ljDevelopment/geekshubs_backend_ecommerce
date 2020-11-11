const { json } = require("express");
const User = require('../model/User');
const SHA256 = require("crypto-js/sha256");
const Base64 = require('crypto-js/enc-base64');

const UsersController = {};


UsersController.login = (req, res, next) => {

	const { body } = req;

	User.findByCredentials(
		body
	)
	.then(async u => {

		u.token = await u.generateAuthToken(); 
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

	const { id } = req.params;
	const { token } = req.query;
	
	User.get({ id, token})
		.then(u => { 
			res.json(u);
		})
		.catch(err => res.status(err.code).json({err : err}))
}


UsersController.update = (req, res, next) => {

	const { id } = req.params;
	const { body } = req;	
	const { query } = req;

	User.updateById({ id : id, ...body, ...query })
		.then(u => res.json(u))
		.catch(err => res.status(401).json({err : err}));	
}



module.exports = UsersController;