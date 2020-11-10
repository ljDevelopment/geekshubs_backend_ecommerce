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
	tokens: String
}
	, { timestamps: true });

UserSchema.statics.new = async function(data) {

	validateFields(data, ['name', 'email', 'password' ]);

	data.password = Base64.stringify(SHA256(data.password));

	const result = await User.create(data)
		.then(u => u)
		.catch(e => e);

	if (result.code) {
		throw result;
	}	
	return result;
}

UserSchema.statics.findByCredentials
	= async function (credentials) {

		validateFields(credentials, ['email', 'password' ]);

		credentials.password = Base64.stringify(SHA256(credentials.password));

		const user = await User.findOne(credentials);
		if (!user) {
			throw { code : 401, err: "Wrong credentials" };
		}


		// const token = await user.generateAuthToken();

		// console.log(token);

		return user;
	}


UserSchema.statics.get = async function (id) {

	validateFields({ id }, [ 'id' ]);


	const result = await User.findById(id)
		.then (u => u)
		.catch(e => null);

	if (!result) {

		throw { code : 401, err: `User not found by id: ${id}` };
	}

	return result;
}


UserSchema.statics.updateById = async function (data) {

	let user = await User.get(data._id);

	for (let field in data) {
		if (field === '_id') { continue; }

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

UserSchema.methods.generateAuthToken = function () {

	const user = this;
	const access = 'auth';
	const token = jwt.sign({ _id: user._id }, 'secretJsonwebtokens');

	return this.updateOne({
		$push: {
			tokens: token
		}
	});
}

UserSchema.methods.toJSON = function () {
	const user = this.toObject();
	delete user.password
	return user;
};


function validateFields(fields, expected) {

	for (let i = 0; i < expected.length; ++i) {

		let field = expected[i];
		if (!fields[field]) {
			throw {code : 400, err : `Field not found ${field}`};
		}
	}
}


const User = mongoose.model('User', UserSchema);

module.exports = User;