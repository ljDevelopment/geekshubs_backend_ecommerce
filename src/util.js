const jwt = require('jsonwebtoken');

const roles = {
	user: 'user',
	vendor: 'vendor',
	admin: 'admin'
}


function validateFields(fields, expected) {

	for (let i = 0; i < expected.length; ++i) {

		let field = expected[i];
		if (!fields[field]) {
			throw { code: 400, err: `Field not found ${field}` };
		}
	}
}

function generateAuthToken({_id, role}) {

	const token = jwt.sign({ _id, role }, process.env.JWT_SECRET);

	return token;
}

function verifyAuthToken(_id, token) {

	try {
		const decoded = jwt.verify(token, process.env.JWT_SECRET);

		if (decoded.role == roles.admin) {
			return true;
		}

		if (decoded._id != _id) {
			throw `Payload missmatched: ${decoded._id} != ${user._id}`;
		}
	}
	catch (e) {
		throw { code: 401, err: e };
	}
}



exports.validateFields = validateFields;
exports.generateAuthToken = generateAuthToken;
exports.verifyAuthToken = verifyAuthToken;
exports.roles = roles;