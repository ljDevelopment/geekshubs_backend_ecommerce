const { json } = require("express");
const User = require('../model/User');


const UsersController = {};


UsersController.login = (req, res, next) => {

    res.end("login");
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

    res.end("getData");
}


module.exports = UsersController;