const { json } = require("express");
// const mongoose = require('../config/mongoose');
const User = require("../model/User");

const TestsController = {};


TestsController.base = (req, res, next) => {

    res.end("base");
}


TestsController.cleandb = async (req, res, next) => {

	await User.deleteMany({}, function(err) {
		
		if (err) {
			res.status(400).json(err);
			return;
		}
		res.json({ok: true});
	})
}

module.exports = TestsController;