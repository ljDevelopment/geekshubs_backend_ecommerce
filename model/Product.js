const mongoose = require('../config/mongoose');
const util = require('../src/util');


const ProductSchema = new mongoose.Schema({
	name: String,
	category: String,
	price: Number,
	vendor:
		{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }

}
	, { timestamps: true });


ProductSchema.statics.new = async function ({ data, token }) {

	util.validateFields({ ...data, token }, ['name', 'category', 'price', 'vendor', 'token']);
	util.verifyAuthToken({ _id: data.vendor, role: util.roles.vendor }, token);

	let error;
	const result = await Product.create(data)
		.then(u => u)
		.catch(e => error = e);

	if (error) {
		error.code = error.code || 400;
		throw error;
	}

	await Product.ensureIndexes();

	return result;
}

async function get(id) {

	let result = await Product.findById(id)
		.then(p => p)
		.catch(e => { err: `Product not found by id: ${id}` });

	if (!result) {
		throw { code: 412, err: `Product not found by id: ${id}` };
	}

	if (result.err) {
		throw { code: 400, err: result.err };
	}

	return result;
}

ProductSchema.statics.erase = async function ({ _id, token }) {

	util.validateFields({ _id, token }, ['_id', 'token']);

	let product = await get(_id);

	util.verifyAuthToken({ _id: product.vendor, role: util.roles.vendor }, token);

	await Product.deleteOne({ _id: product._id });

	return product;
}


ProductSchema.statics.updateById = async function (data) {

	const { id, token } = data;
	util.validateFields({ id, token }, ['id', 'token']);

	let product = await get(id);

	util.verifyAuthToken({ _id: product.vendor, role: util.roles.vendor }, token);

	for (let field in data) {
		if (field === 'id') { continue; }
		if (field === 'token') { continue; }

		if (typeof (product[field]) === undefined) {
			throw ("Field not found to update: " + field);
		}
		product[field] = data[field];
	}

	++product.__v;
	product.updatedAt = Date.now();

	await product.replaceOne(product);

	return product;
}


ProductSchema.statics.list = async function (filters, groupBy) {

	const aggregation = util.buildDbAggregation(filters, groupBy);
	let products = await Product.aggregate(aggregation);

	if (groupBy && products.length == 1 && !products[0]._id) {
		throw { code: 400, err: `Unknown group by field ${groupBy}` };
	}

	return products;
}

const Product = mongoose.model('Product', ProductSchema);
module.exports = Product;