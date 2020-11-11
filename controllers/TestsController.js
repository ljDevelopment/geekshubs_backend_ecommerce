const { json } = require("express");
const mongoose = require('../config/mongoose');
const User = require("../model/User");

const TestsController = {};


TestsController.base = (req, res, next) => {

	res.end("base");
}


TestsController.cleandb = async (req, res, next) => {

	// try {
	// 	await mongoose.connection.dropCollection('users');

	// 	res.json({ ok: true });
	// }
	// catch (e) {
	// 	res.status(400).json(e);
	// }
	await User.deleteMany({}, function(err) {

		if (err) {
			res.status(400).json(err);
			return;
		}
		res.json({ok: true});
	})
}

module.exports = TestsController;