const mongoose = require('../config/mongoose');
const util = require('../src/util');


const ProductSchema = new mongoose.Schema({
	name: String,
	category : String,
	price: Number,
	vendor:
		{type: mongoose.Schema.Types.ObjectId, ref: 'User'}
	  
}
	, { timestamps: true });


ProductSchema.statics.new = async function(data) {

	util.validateFields(data, ['name', 'category', 'price', 'vendor']);

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

const Product = mongoose.model('Product', ProductSchema);
module.exports = Product;