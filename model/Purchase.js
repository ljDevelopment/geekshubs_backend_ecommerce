const mongoose = require('../config/mongoose');
const util = require('../src/util');


const PurchaseSchema = new mongoose.Schema({
	name: String,
	category: String,
	price: Number,
	buyer:
		{ type: mongoose.Schema.Types.ObjectId, ref: 'User' },
	vendor:
		{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }

}
	, { timestamps: true });


PurchaseSchema.statics.new = async function ({ data, token }) {

	util.validateFields({ ...data, token }, ['name', 'category', 'price', 'buyer', 'vendor', 'token']);
	util.verifyAuthToken({ _id: data.buyer, role: util.roles.user }, token);

	let error;
	const result = await Purchase
		.create(data)
		.then(u => u)
		.catch(e => error = e);

	if (error) {
		error.code = error.code || 400;
		throw error;
	}

	await Purchase
		.ensureIndexes();

	return result;
}

async function get(id) {

	let result = await Purchase
		.findById(id)
		.then(p => p)
		.catch(e => {
			err: `Purchase not found by id: ${id}`
		});

	if (!result) {
		throw {
			code: 412, err: `Purchase not found by id: ${id}`
		};
	}

	if (result.err) {
		throw { code: 400, err: result.err };
	}

	return result;
}


PurchaseSchema.statics.updateById = async function (data) {

	const { id, token } = data;
	util.validateFields({ id, token }, ['id', 'token']);

	let purchase = await get(id);

	util.verifyAuthToken({ _id: purchase.vendor, role: util.roles.vendor }, token);

	for (let field in data) {
		if (field === 'id') { continue; }
		if (field === 'token') { continue; }

		if (typeof (purchase[field]) === undefined) {
			throw ("Field not found to update: " + field);
		}
		purchase[field] = data[field];
	}

	++purchase.__v;
	purchase.updatedAt = Date.now();

	await purchase.replaceOne(purchase);

	return purchase;
}


PurchaseSchema.statics.list = async function (token, filters, groupBy) {

	util.validateFields({ token }, ['token']);

	const payload = util.verifyAuthToken({}, token);

	let filter = {};

	let field;
	switch (payload.role) {
		case util.roles.user:
			field = 'buyer';
			break;

		case util.roles.vendor:
			field = 'vendor';
			break;

		case util.roles.admin:
			// DO NOTHING, admin returns all purchases
			break;

		default:
			throw `Unknown role ${payload.role}`;
	}

	filters = filters || {};
	if (field) {
		filters[field] = new mongoose.Types.ObjectId(payload._id);
	}

	const aggregation = util.buildDbAggregation(filters, groupBy);
	let purchase = await Purchase.aggregate(aggregation);

	if (groupBy && purchase.length == 1 && !purchase[0]._id) {
		throw { code: 400, err: `Unknown group by field ${groupBy}` };
	}

	return purchase;
}

const Purchase = mongoose.model('Purchase', PurchaseSchema);
module.exports = Purchase;