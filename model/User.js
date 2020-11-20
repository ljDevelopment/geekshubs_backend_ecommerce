const mongoose = require('../config/mongoose');
const SHA256 = require("crypto-js/sha256");
const Base64 = require('crypto-js/enc-base64');
const util = require('../src/util');


const UserSchema = new mongoose.Schema({
	name: String,
	email: {
		type: String,
		required: true,
		unique: true
	},
	password: String,
	token: String,
	role: {
		type: String,
		enum: [ util.roles.user, util.roles.admin, util.roles.vendor ],
		default: util.roles.user
	}
}
	, { timestamps: true });

UserSchema.statics.new = async function (data) {

	util.validateFields(data, ['name', 'email', 'password']);
	data.password = Base64.stringify(SHA256(data.password));

	if (!data.role) {

		delete data.role;
	} 

	const result = await User.create(data)
		.then(u => u)
		.catch(e => e);

	if (result.code) {
		throw result;
	}
	if (result.errors && result.errors.role) 
	{
		throw { code : 400, err : `Unknown role ${data.role}` };
	}

	await User.ensureIndexes();

	return result;
}

UserSchema.statics.findByCredentials
	= async function (credentials) {

		util.validateFields(credentials, ['email', 'password']);

		credentials.password = Base64.stringify(SHA256(credentials.password));

		const user = await User.findOne(credentials);

		if (!user) {
			throw { code: 401, err: "Wrong credentials" };
		}

		return user;
	}


UserSchema.statics.get = async function ({ id, token }) {

	util.validateFields({ id, token }, ['id', 'token']);

	let result = await User.findById(id)
		.then(u => u)
		.catch(e => { err: `User not found by id: ${id}` });

	if (!result) {
		throw { code : 412, err : `User not found by id: ${id}` };
	}
	if (result.err) {
		throw { code : 400, err : result.err };
	}
	
	util.verifyAuthToken({ _id : result._id }, token);

	return result;
}


UserSchema.statics.updateById = async function (data) {

	let user = await User.get(data);

	for (let field in data) {
		if (field === 'id') { continue; }
		if (field === 'token') { continue; }

		if (typeof (user[field]) === 'undefined') {
			throw { code: 400, err : `Field not found to update: ${field}` };
		}
		user[field] = data[field];
	}

	if (user.password)
	{
		user.password = Base64.stringify(SHA256(data.password));
	}
	++user.__v;
	user.updatedAt = Date.now();

	await user.replaceOne(user);

	return user;
}



UserSchema.methods.toJSON = function () {
	const user = this.toObject();
	delete user.password;
	return user;
};




const User = mongoose.model('User', UserSchema);

module.exports = User;