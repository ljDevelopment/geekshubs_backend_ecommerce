const User = require("../model/User");
const Product = require("../model/Product");
const Purchase = require("../model/Purchase");

const TestsController = {};


TestsController.base = (req, res, next) => {

	res.end("base");
}


TestsController.cleanUsers = async (req, res, next) => {

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

TestsController.cleanProducts = async (req, res, next) => {

	await Product.deleteMany({}, function(err) {

		if (err) {
			res.status(400).json(err);
			return;
		}
		res.json({ok: true});
	})
}



TestsController.cleanPurchases = async (req, res, next) => {

	await Purchase.deleteMany({}, function(err) {

		if (err) {
			res.status(400).json(err);
			return;
		}
		res.json({ok: true});
	})
}

module.exports = TestsController;