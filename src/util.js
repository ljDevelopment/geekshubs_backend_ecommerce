
function validateFields(fields, expected) {

	for (let i = 0; i < expected.length; ++i) {

		let field = expected[i];
		if (!fields[field]) {
			throw { code: 400, err: `Field not found ${field}` };
		}
	}
}


exports.validateFields = validateFields;