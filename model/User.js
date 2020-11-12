const mongoose = require('../config/mongoose');
const SHA256 = require("crypto-js/sha256");
const Base64 = require('crypto-js/enc-base64');
const jwt = require('jsonwebtoken');
const util = require('../src/util');

const roles = {
	user: 'user',
	vendor: 'vendor',
	admin: 'admin'
}

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
		default: roles.user
	}
}
	, { timestamps: true });

UserSchema.statics.new = async function (data) {

	util.validateFields(data, ['name', 'email', 'password']);
	data.password = Base64.stringify(SHA256(data.password));

	if (!data.role) {

		delete data.role;
	} else if (!roles[data.role]) {

		throw { code: 400, err: "Unknown role " + data.role };
	}

	const result = await User.create(data)
		.then(u => u)
		.catch(e => e);

	if (result.code) {
		throw result;
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

	try {

		if (!result) {
			throw `User not found by id: ${id}`;
		}
		if (result.err) {
			throw result.err;
		}

		result.verifyAuthToken(token);
	} catch (e) {

		throw { code: 401, err: e };
	}

	return result;
}


UserSchema.statics.updateById = async function (data) {

	let user = await User.get(data);

	for (let field in data) {
		if (field === 'id') { continue; }
		if (field === 'token') { continue; }

		if (typeof (user[field]) === undefined) {
			throw ("Field not found to update: " + field);
		}
		user[field] = data[field];
	}

	++user.__v;
	user.updatedAt = Date.now();

	await user.replaceOne(user);

	return user;
}

UserSchema.methods.generateAuthToken = async function () {
	const user = this;

	const token = jwt.sign({ _id: user._id, role: user.role }, process.env.JWT_SECRET);

	return token;
}

UserSchema.methods.verifyAuthToken = function (token) {

	const user = this;

	try {

		const decoded = jwt.verify(token, process.env.JWT_SECRET);
console.log(decoded);
		if (decoded.role == roles.admin) {
			return true;
		}

		if (decoded._id != user._id) {
			throw `Payload missmatched: ${decoded._id} != ${user._id}`;
		}
	}
	catch (e) {
		throw { code: 401, err: e };
	}
}


UserSchema.methods.toJSON = function () {
	const user = this.toObject();
	delete user.password;
	return user;
};




const User = mongoose.model('User', UserSchema);

module.exports = User;