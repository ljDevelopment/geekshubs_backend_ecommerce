const mongoose = require('../config/mongoose');

const UserSchema = new mongoose.Schema({
	name: String,
	email: {
		type : String,
		required : true,
		unique : true
	},
	password: String
}
, {timestamps: true});

UserSchema.methods.toJSON = function () {
	const user = this.toObject();
	delete user.password
	return user;
};

const User = mongoose.model('User', UserSchema);

module.exports = User;