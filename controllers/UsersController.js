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
			console.log(err);
			console.log(instance);
			if (err) return res.end(err);
			res.end(JSON.stringify(instance));
		}
	);
}


UsersController.getData = (req, res, next) => {

    res.end("getData");
}


module.exports = UsersController;