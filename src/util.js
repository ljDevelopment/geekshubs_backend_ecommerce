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

function verifyAuthToken({ _id, role }, token) {

	try {
		const decoded = jwt.verify(token, process.env.JWT_SECRET);

		if (role && decoded.role == roles.admin)
		{
			return true;
		}

		if (_id && role) {
			if (decoded._id == _id
				&& decoded.role == role){
					return true;
				}
		} else if (_id) {

			role = role || roles.admin;

			if (decoded._id == _id
				|| decoded.role == role ){
					return true;
				}	
		} else if (role) {

			if (decoded.role == role ){
				return true;
			}
		} else {

			throw "No restriction (id nor role) defined";
		}

		if (_id)
		{
			throw `Payload missmatched: ${decoded._id} != ${_id}`;
		}
		if (role) {
		
			throw `Payload missmatched: ${decoded.role} != ${role}`;	
		}

	} catch (e) {
		throw { code: 401, err: e };
	}
}


function getFieldFromRequest(req, field) {

	let value = (req.params && req.params[field])
		|| (req.body && req.body[field])
		|| (req.query && req.query[field]);
	return value;
}

exports.validateFields = validateFields;
exports.generateAuthToken = generateAuthToken;
exports.verifyAuthToken = verifyAuthToken;
exports.roles = roles;
exports.getFieldFromRequest = getFieldFromRequest;