const mongoose = require('../config/mongoose');

const UserSchema = new mongoose.Schema({
	name: String,
	email: String,
	password: String
	});

const User = mongoose.model('User', UserSchema);

module.exports = User;