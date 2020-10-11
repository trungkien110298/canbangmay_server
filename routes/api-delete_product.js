var express = require('express');
var mongoose = require('mongoose');
var Product = require('../models/product');
var auth = require('../controller/authController')


var api_delete_product = express.Router();

api_delete_product.post("/api-delete_product", auth.isAuthenticated, (req, res) => {
	console.log("/api-delete_product");
	_id = mongoose.Types.ObjectId(req.body.product._id);
	console.log("Delete product: " + _id);
	Product.deleteOne({ _id: _id }, function (err) {
		if (err) console.log(err);
		else res.send({ code: 200, message: "Delete success" });
	});
	// res.send({ code: 200, message: 'Delete success' })
});

module.exports = api_delete_product;
