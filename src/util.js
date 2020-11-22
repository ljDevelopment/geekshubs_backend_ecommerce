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

function generateAuthToken({ _id, role }) {

	const token = jwt.sign({ _id, role }, process.env.JWT_SECRET);

	return token;
}

function verifyAuthToken({ _id, role }, token) {

	try {
		const payload = jwt.verify(token, process.env.JWT_SECRET);

		if (role && payload.role == roles.admin) {
			return payload;
		}

		if (_id && role) {
			if (payload._id == _id
				&& payload.role == role) {
				return payload;
			}
		} else if (_id) {

			role = role || roles.admin;

			if (payload._id == _id
				|| payload.role == role) {
				return payload;
			}
		} else if (role) {

			if (payload.role == role) {
				return payload;
			}
		} else {

			return payload;
		}

		if (_id) {
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


function buildDbAggregation(filters, groupBy) {
	
	let filter = buildDbFilter(filters);
	const aggregation = [{ $match: filter }];

	if (groupBy) {

		aggregation.push(
			{
				$group:
				{
					_id: '$' + groupBy,
					elements : { $push: "$$ROOT" }
				}
			}
		);
	}
	
	return aggregation
}

function buildDbFilter(filters) {

	let filter = {};

	for (let field in filters) {

		let fieldValue = filters[field];
		if (fieldValue.op) {

			filter[field] = parseNumberFilter(fieldValue);
		} else if (typeof (fieldValue) === 'string') {

			filter[field] = new RegExp(fieldValue, 'i');
		}
	}

	return filter;
}

function parseNumberFilter(numberFilter) {

	switch (numberFilter.op) {
		case '=':
			return { $eq: parseFloat(numberFilter.value) };
		case '!=':
			return { $ne: parseFloat(numberFilter.value) };
		case '>':
			return { $gt: parseFloat(numberFilter.value) };
		case '>=':
			return { $gte: parseFloat(numberFilter.value) };
		case '<':
			return { $lt: parseFloat(numberFilter.value) };
		case '<=':
			return { $lte: parseFloat(numberFilter.value) };
		case 'in':
			return { $in: parseFloat(numberFilter.value) };
		case 'nin':
			return { $nin: parseFloat(filters.price.value) };
		default:
			throw `Unknown op ${filters.price.op}`;
	}
}

exports.validateFields = validateFields;
exports.generateAuthToken = generateAuthToken;
exports.verifyAuthToken = verifyAuthToken;
exports.roles = roles;
exports.getFieldFromRequest = getFieldFromRequest;
exports.buildDbAggregation = buildDbAggregation;