const mongoose = require('mongoose');

mongoose.connect('mongodb+srv://ecommerce:ecommerce@cluster0.lkys6.mongodb.net/ecommerce?retryWrites=true&w=majority', {
	useNewUrlParser: true,
	useUnifiedTopology: true,
	useCreateIndex: true,
	useFindAndModify: false
});

module.exports = mongoose;