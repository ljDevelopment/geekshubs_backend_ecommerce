const { json } = require("express");


const TestsController = {};


TestsController.base = (req, res, next) => {

    res.end("base");
}



module.exports = TestsController;