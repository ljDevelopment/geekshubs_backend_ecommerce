const { json } = require("express");
const User = require('../model/User');
const SHA256 = require("crypto-js/sha256");
const Base64 = require('crypto-js/enc-base64');

const UsersController = {};


UsersController.login = (req, res, next) => {

	const { body } = req;

	let valid = true;
	['email', 'password'].forEach(
		field => {
			if (!body[field]){
				res.status(400).json({err : `Needed field: ${field}`});
				valid = false;
				return;
			}
		}
	)
	
	if (!valid) {
		return;
	};

	body.password = Base64.stringify(SHA256(body.password));

	User.findByCredentials(
		body
	)
	.then(u => res.json(u))
	.catch(err => res.status(401).json({err : err}));
}


UsersController.signup = (req, res) => {

	const { body } = req;

	let valid = true;
	['name', 'email', 'password'].forEach(
		field => {
			if (!body[field]){
				res.status(400).json({err : `Needed field: ${field}`});
				valid = false;
				return;
			}
		}
	);

	if (!valid) {
		return;
	}

	body.password = Base64.stringify(SHA256(body.password));

	User.create(
		body,
		function(err, instance) {

			if (err) {

				let status = (err.code == 11000)
					? 412
					: 0;
				res.status(status).json(err);
			}
			res.json(instance);
		}
	);
}


UsersController.getData = (req, res, next) => {

	const { id } = req.params;
	
	User.get(id)
		.then(u => res.json(u))
		.catch(err => res.status(401).json({err : err}));
}


module.exports = UsersController;