const mongoose = require('mongoose');

// https://dev.to/emmysteven/solved-mongoose-unique-index-not-working-45d5	
mongoose.connect(process.env.MONGODB_URL, {
	useNewUrlParser: true,
	useCreateIndex: true,
	autoIndex: true, //this is the code I added that solved it all
	keepAlive: true,
	poolSize: 10,
	bufferMaxEntries: 0,
	connectTimeoutMS: 10000,
	socketTimeoutMS: 45000,
	family: 4, // Use IPv4, skip trying IPv6
	useFindAndModify: false,
	useUnifiedTopology: true
})
	.then(() => console.log('> Successfully connected to DB'))
	.catch(err => console.log(err));

module.exports = mongoose;