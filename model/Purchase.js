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

	if (field) {
		filter[field] = new mongoose.Types.ObjectId(payload._id);
	}

	try {
		if (filters.price) {

			switch (filters.price.op) {
				case '=':
					filter = { price: { $eq: filters.price.value } };
					break;
				case '!=':
					filter = { price: { $ne: filters.price.value } };
					break;
				case '>':
					filter = { price: { $gt: filters.price.value } };
					break;
				case '>=':
					filter = { price: { $gte: filters.price.value } };
					break;
				case '<':
					filter = { price: { $lt: filters.price.value } };
					break;
				case '<=':
					filter = { price: { $lte: filters.price.value } };
					break;
				case 'in':
					filter = { price: { $in: filters.price.value } };
					break;
				case 'nin':
					filter = { price: { $nin: filters.price.value } };
					break;
				default:
					throw `Unknown op ${filters.price.op}`;
			}
		}

		if (filters.name) {

			filter.name = new RegExp(filters.name, 'i');
		}
	} catch (e) {
		throw { err: e };
	}

	const aggregation = [{ $match: filter }];
	if (groupBy) {

		aggregation.push(
			{
				$group:
				{
					_id: '$' + groupBy,
					products: { $push: "$$ROOT" }
				}
			}
		);
	}


	let products = await Purchase
		.aggregate(aggregation);

	if (groupBy && products.length == 1 && !products[0]._id) {
		throw { code: 400, err: `Unknown group by field ${groupBy}` };
	}

	return products;
}

const Purchase = mongoose.model('Purchase', PurchaseSchema);
module.exports = Purchase;