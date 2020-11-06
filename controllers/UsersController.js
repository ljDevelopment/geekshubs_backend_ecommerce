const { json } = require("express");
const User = require('../model/User');


const UsersController = {};


UsersController.login = (req, res, next) => {

    res.end("login");
}


UsersController.signup = (req, res) => {

	const { body } = req;
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