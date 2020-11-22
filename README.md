

#  2020-09- Backend Express

 - **Author**: Luis Javier López Arredondo
 - **Technologies**: [NodeJS](https://nodejs.dev/), [Express](https://expressjs.com/), [MongoDB](https://www.mongodb.com/), [Mongoose](https://mongoosejs.com/), [Postman](https://www.postman.com/)
 - **Abstract**: Final challenge for the course *2020-09- Backend Express* at [GeeksHubs](https://geekshubs.com/). Description for the requirements of the challenge can be found in [Reto Final Backend E-Commerce - BTC Backend.pdf](Reto%20Final%20Backend%20E-Commerce%20-%20BTC%20Backend.pdf).

### To evaluate
- All requirements fulfilled, including extras.
- MVC architecture.
- Important config data hidden in environment variables using [dotenv](https://www.npmjs.com/package/dotenv).
- Password stored hashed to protect plain passwords to be stolen or watched.
- Unit testing with Postman only in dev environment.

#### Table of contents
1. How to...
	1. [How to install](#how-to-install)
	2. [How to run](#how-to-run)
	3. [How to run unit tests](#how-to-run-unit-tests)
2. Requirements
3. DB
4. Backend endpoints
	1. User endpoints
	2. Product endpoints
	3. Purchase endpoints

## How to...
### How to install
1. Install [NodeJS](https://nodejs.dev/).
2. Run 'npm install'
3. Setup a [MongoDB](https://www.mongodb.com/) data base.
### How to run
1. Create a .env file in the root of the project with these variables:
	- PORT: listening port (3000 will be used if not set).
	- MONGODB_URL: url of the [MongoDB](https://www.mongodb.com/) to be used.
	- ENV: environment identifier (if equals to 'dev', tests end points will be enabled).
	- JWT_SECRET: private key used to generate auth [tokens](#token-authentication).
2. Command line:
	1. Production: `npm start` --> `node -r dotenv/config ./bin/www`
	2. Development: `npm run dev` --> `nodemon -r dotenv/config ./bin/www` (if you have nodemon package installed as dev)
### How to run unit tests
1. Open [Postman](https://www.postman.com/).
2. Import file *tests/ecommerce.postman_collection.json*.
3. Open Postman's Runner.
4. Select the folder *tests*.
5. In *Data*, select the file *tests/data.csv*.
6. Launch the tests with the button *run*.
## Requirements
-  **Users**: Token authentication
-  **Users**: Login
-  **Users**: Signup
-  **Users**: User data
-  **Users**: EXTRA: user roles
-  **Users**: EXTRA: user update
-  **Products**: Create, remove, update (by vendor)
-  **Products**: List products
-  **Products**: Filter products
-  **Products**: EXTRA: by vendor
-  **Products**: EXTRA: by category
-  **Purchases**: Add purchase
-  **Purchases**: List purchases 
-  **Purchases**: EXTRA: by user
-  **Purchases**: EXTRA: update (by vendor)
## DB
[MongoDB](https://www.mongodb.com/) and [Mongoose](https://mongoosejs.com/).
### User
*[model/User.js](model/User.js)*
```javascript
const UserSchema = new mongoose.Schema({
	name: String,
	email: {
		type: String,
		required: true,
		unique: true
	},
	password: String,
	token: String,
	role: {
		type: String,
		enum: [ util.roles.user, util.roles.admin, util.roles.vendor ],
		default: util.roles.user
	}
}
	, { timestamps: true })
```
### Product
*[model/Product.js](model/Product.js)*
```javascript
const ProductSchema = new mongoose.Schema({
	name: String,
	category: String,
	price: Number,
	vendor:
		{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }

}
	, { timestamps: true })
```
### Purchase
*[model/Purchase.js](model/Purchase.js)*
```javascript
const PurchaseSchema = new mongoose.Schema({
	name: String,
	category: String,
	price: Number,
	buyer:
		{ type: mongoose.Schema.Types.ObjectId, ref: 'User' },
	vendor:
		{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }
}
	, { timestamps: true })
```

## Backend endpoints
### User endpoints
*[routes/users.js](routes/users.js)*
#### User signup
Creates a new user. Default role if not provided is 'user'. If ok, returns the data of the new user created.

**POST** /users/signup

- [body] name: string (required)
- [body] email: string (required)
- [body] password: string (required)
- [body] role: string (default 'user')

**status**(200): Ok
```json
{
    "role": "user",
    "_id": "5fb4dc567f9925eb6a44e560",
    "name": "default",
    "email": "default@emil.com",
    "createdAt": "2020-11-18T08:33:26.741Z",
    "updatedAt": "2020-11-18T08:33:26.741Z",
    "__v": 0
}
```
**status**(400): Any parameter missing or wrong role.
**status**(412): Duplicated email

#### User login
Validates the credentials sent. If ok, returns the data of the user, plus the generated token used for future request validations.

**POST** /users/login
- [body] email: string (required)
- [body] password: string (required)

**status**(200): Ok
```json
{
    "role": "user",
    "_id": "5fb4dade71d811e9aa34fc29",
    "name": "default",
    "email": "default@emil.com",
    "createdAt": "2020-11-18T08:27:10.151Z",
    "updatedAt": "2020-11-18T08:27:10.151Z",
    "__v": 0,
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI1ZmI0ZGFkZTcxZDgxMWU5YWEzNGZjMjkiLCJyb2xlIjoidXNlciIsImlhdCI6MTYwNTY4ODAzMH0.eDKFhi5a_E-d5MLWAS0yYppfhusVH--p4ksvjJJSYew"
}
```

**status**(400): Any parameter missing
**status**(401): User not found with that credentials


#### Get user data
Retrieves the data of one user. To get the user data, the token provided must be from itself or from an admin.

**GET** /users/:id

- [params] id: string (required)
- [body | query | params]token: string (required)

**status**(200): Ok
```json
{
    "role": "user",
    "_id": "5fb4e80d9dc8a9f3353f20d8",
    "name": "user",
    "email": "user@emil.com",
    "createdAt": "2020-11-18T09:23:25.451Z",
    "updatedAt": "2020-11-18T09:23:25.451Z",
    "__v": 0
}
```

**status**(400): Any parameter missing
**status**(401): Token expired, insufficient permissions.
**status**(412): User not found.

#### Update user data
Changes the data of one user. To update the user data, the token provided must be from itself or from an admin.

**PUT** /users/:id

- [params] id: string (required)
- [query]token: string (required)
- [body] name: string (optional)
- [body] email: string (optional)
- [body] password: string (optional)

**status**(200): Ok
```json
{
    "role": "user",
    "_id": "5fb4e80d9dc8a9f3353f20d8",
    "name": "user",
    "email": "user@emil.com",
    "createdAt": "2020-11-18T09:23:25.451Z",
    "updatedAt": "2020-11-18T09:23:25.451Z",
    "__v": 0
}
```

**status**(400): Any parameter missing or wrong field provided to be updated.
**status**(401): Token expired, insufficient permissions.
**status**(412): User not found.

### Product endpoints
*[routes/products.js](routes/products.js)*
#### Create product
Creates a new product. If ok, returns the data of the new product created.

**POST** /products/

- [body] name: string (required)
- [body] category: string (required)
- [body] price: number (required)
- [body] vendor: string (required)
- [gody | query | params] token: string (required)

**status**(200): Ok
```json
{
    "_id": "5fb538e0743ba8f96868be5e",
    "name": "Bordertown",
    "category": "Health",
    "price": 308.64,
    "vendor": "5fb538e0743ba8f96868be5c",
    "createdAt": "2020-11-18T15:08:16.861Z",
    "updatedAt": "2020-11-18T15:08:16.861Z",
    "__v": 0
}
```
**status**(400): Any parameter missing.
**status**(401): Token expired, insufficient permissions.

#### Delete product
Deletes de product with the given id. Only admin or the vendor of the product can delete the product. If the product is removed ok, it is returned.

**DELETE** /products/:id

- [body | query | params] id: string (required)
- [body | query | params] token: string (required)

**status**(200): Ok
```json
{
    "_id": "5fb538e0743ba8f96868be5e",
    "name": "Bordertown",
    "category": "Health",
    "price": 308.64,
    "vendor": "5fb538e0743ba8f96868be5c",
    "createdAt": "2020-11-18T15:08:16.861Z",
    "updatedAt": "2020-11-18T15:08:16.861Z",
    "__v": 0
}
```
**status**(400): Any parameter missing.
**status**(401): Token expired, insufficient permissions or user not found.
**status**(412): No product found.

#### Update product data
Changes the data of one product. To update the product data, the token provided must be from its vendor or from an admin.

**PUT** /products/:id

- [body | query | params]  id: string (required)
- [query] token: string (required)
- [body] name: string (optional)
- [body] category: string (optional)
- [body] float: number (optional)

**status**(200): Ok
```json
{
    "_id": "5fb7fabc743ba8f96868bf24",
    "name": "newName",
    "category": "newCategory",
    "price": 1.1,
    "vendor": "5fb7fabc743ba8f96868bf20",
    "createdAt": "2020-11-20T17:19:56.620Z",
    "updatedAt": "2020-11-20T17:20:05.031Z",
    "__v": 3
}
```

**status**(400): Any parameter missing or wrong field provided to be updated.
**status**(401): Token expired, insufficient permissions.
**status**(412): Product not found.

#### Get products
Get the list of products. Supports filtering and grouping by.

**GET** /products/

- [body | query | params]  groupBy: string (optional)
- [body] filter: <filter object> (optional)

filter object:
```json
{
	"<text_field_name>" : "<regular_expression>",
	"<number_field_name>" : { "op" : "= | != | < | <= | > | >= | in | nin", "value" : "<number>"
}
```

**status**(200): Ok
```json
[{
    "_id": "5fba527b9847923134d998b0",
    "name": "Edge of Darkness",
    "category": "Automotive",
    "price": 865.56,
    "vendor": "5fba527a9847923134d998ac",
    "createdAt": "2020-11-22T11:58:51.090Z",
    "updatedAt": "2020-11-22T11:58:51.090Z",
    "__v": 0
},
...
]
```
(grouped by)
```json
{
    "_id": "Sports",
    "elements": [{
        "_id": "5fba527c9847923134d998bc",
        "name": "Something New",
        "category": "Sports",
        "price": 863.13,
        "vendor": "5fba527a9847923134d998ac",
        "createdAt": "2020-11-22T11:58:52.796Z",
        "updatedAt": "2020-11-22T11:58:52.796Z",
        "__v": 0
    },
    ...]
}, {
    "_id": "Automotive",
    "elements": [
	    ...
    ]
]
```
**status**(400): Filter error or number operator not supported.

### Purchases endpoints
*[routes/purchases.js](routes/purchases.js)*

#### Create purchase
Creates a new purchase. If ok, returns the data of the new purchase. It doesn't store a reference to the product because we are saving the current purchase, just in case that product will change in the future. Only role user or admin can create purchases.

**POST** /purchases/

- [body] name: string (required)
- [body] category: string (required)
- [body] price: number (required)
- [body] buyer: string (required) (ref to user id)
- [body] vendor: string (required) (ref to user id)
- [body | query | params] token: string (required)

**status**(200): Ok
```json
{
    "_id": "5fba527d9847923134d998c6",
    "name": "Beauty and the Boss",
    "category": "Health",
    "price": 1199.19,
    "buyer": "5fba52799847923134d998a8",
    "vendor": "5fba527a9847923134d998ac",
    "createdAt": "2020-11-22T11:58:53.961Z",
    "updatedAt": "2020-11-22T11:58:53.961Z",
    "__v": 0
}
```

**status**(400): Any parameter missing.
**status**(401): Token expired, insufficient permissions.

#### Get purchases
Get the list of purchases. Supports filtering and grouping by. An user only can get its purchases, and a vendor only can get the purchases of its products.

**GET** /purchases/

- [body | query | params]  token: string (required)
- [body | query | params]  groupBy: string (optional)
- [body] filter: <filter object> (optional)

filter object:
```json
{
	"<text_field_name>" : "<regular_expression>",
	"<number_field_name>" : { "op" : "= | != | < | <= | > | >= | in | nin", "value" : "<number>"
}
```

**status**(200): Ok
```json
[{
    "_id": "5fba527d9847923134d998c2",
    "name": "Bordertown",
    "category": "Health",
    "price": 308.64,
    "buyer": "5fba52799847923134d998a8",
    "vendor": "5fba527a9847923134d998ac",
    "createdAt": "2020-11-22T11:58:53.628Z",
    "updatedAt": "2020-11-22T11:58:53.628Z",
    "__v": 0
},
...
]
```
(grouped by)
```json
[{
    "_id": "Jewelery",
    "elements": [{
        "_id": "5fba527f9847923134d998d4",
        "name": "Silvestre",
        "category": "Jewelery",
        "price": 228.52,
        "buyer": "5fba52799847923134d998a8",
        "vendor": "5fba527a9847923134d998ac",
        "createdAt": "2020-11-22T11:58:55.195Z",
        "updatedAt": "2020-11-22T11:58:55.195Z",
        "__v": 0
    },
    ...
    ]
}, {
    "_id": "Shoes",
    "elements": [
    ...
    ]
    },
    ...
]
```
**status**(400): Filter error or number operator not supported.
**status**(401): Token expired.