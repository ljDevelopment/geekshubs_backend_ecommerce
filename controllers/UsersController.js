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
				console.log(err);

				if (err.code == 11000) {
					return res.status(412).json(err);
				}

				return res.json(err);
			}
			res.json(instance);
		}
	);
}


UsersController.getData = (req, res, next) => {

    res.end("getData");
}


module.exports = UsersController;