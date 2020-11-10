const { json } = require('express');
const mongoose = require('../config/mongoose');

const UserSchema = new mongoose.Schema({
	name: String,
	email: {
		type: String,
		required: true,
		unique: true
	},
	password: String
}
	, { timestamps: true });

UserSchema.statics.findByCredentials = async function ({ email,
	password }) {

	const user = await User.findOne({ email, password })
	if (!user) {
		throw "Wrong credentials";
	}
	console.log(user);
	return user
}


UserSchema.statics.get = async function (id) {

	const user = await User.findById(id)
	if (!user) {
		throw "User not found by id:" + id;
	}
	
	return user
}


UserSchema.methods.toJSON = function () {
	const user = this.toObject();
	delete user.password
	return user;
};

const User = mongoose.model('User', UserSchema);

module.exports = User;