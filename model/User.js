const { json } = require('express');
const mongoose = require('../config/mongoose');
const SHA256 = require("crypto-js/sha256");
const Base64 = require('crypto-js/enc-base64');
var jwt = require('jsonwebtoken');
const e = require('express');

const UserSchema = new mongoose.Schema({
	name: String,
	email: {
		type: String,
		required: true,
		unique: true
	},
	password: String,
	token: String,
	tokens: Array,
	role : {
		type : String,
		default : 'user'
	}
}
	, { timestamps: true });

UserSchema.statics.new = async function (data) {

	validateFields(data, ['name', 'email', 'password']);
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

	await User.ensureIndexes();

	return result;
}

UserSchema.statics.findByCredentials
	= async function (credentials) {

		validateFields(credentials, ['email', 'password']);

		credentials.password = Base64.stringify(SHA256(credentials.password));

		const user = await User.findOne(credentials);
		if (!user) {
			throw { code: 401, err: "Wrong credentials" };
		}

		return user;
	}


UserSchema.statics.get = async function ({ id, token }) {

	validateFields({ id, token }, ['id', 'token']);

	let result = await User.findById(id)
		.then(u => u)
		.catch(e => { err: `User not found by id: ${id}` });
		
	try {

		if (!result) {
			throw `User not found by id: ${id}`;
		}
		if (result.err){
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
	const token = jwt.sign({ _id: user._id }, 'secretJsonwebtokens');

	await this.updateOne({
		$push: {
			tokens: token
		}
	});
	return token;
}

UserSchema.methods.verifyAuthToken = function (token) {

	const user = this;

	try {
		if (!user.tokens) {
			throw "No tokens";
		}

		if (!user.tokens.includes(token)) {
			throw "Token missmatched";
		}

		const decoded = jwt.verify(token, 'secretJsonwebtokens');

		if (decoded._id != user._id) {
			throw "Payload missmatched";
		}
	}
	catch (e) {
		throw { code: 401, err: e };
	}
}


UserSchema.methods.toJSON = function () {
	const user = this.toObject();
	user.password && delete user.password;
	user.tokens && delete user.tokens;
	return user;
};


function validateFields(fields, expected) {

	for (let i = 0; i < expected.length; ++i) {

		let field = expected[i];
		if (!fields[field]) {
			throw { code: 400, err: `Field not found ${field}` };
		}
	}
}


const User = mongoose.model('User', UserSchema);

module.exports = User;