 const config = {

	"dev": {
		"MONODB_URL": "mongodb+srv://eCommerceTest:eCommerceTest@cluster0.n68pu.mongodb.net/test",
		"PORT": 3000
	},

	"pro": {
		"MONODB_URL": "mongodb+srv://ecommerce:ecommerce@cluster0.lkys6.mongodb.net/ecommerce?retryWrites=true&w=majority",
		"PORT": 8080
	}
};


const env = process.env.NODE_ENV || 'pro';

module.exports = {
    config: config[env],
    env: env,
};