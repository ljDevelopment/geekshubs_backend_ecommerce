const { json } = require("express");


const UsersController = {};


UsersController.login = (req, res, next) => {

    res.end("login");
}


UsersController.signup = (req, res) => {

    const { body } = req;
    res.end(JSON.stringify(body));
}


UsersController.getData = (req, res, next) => {

    res.end("getData");
}


module.exports = UsersController;