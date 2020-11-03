var express = require('express');
var Product = require('../models/product');
var postAuth = require('../controller/postAuthController')

var api_check_product_id = express.Router();

api_check_product_id.post("/api-check_product_id", postAuth.isAuthenticated, (req, res) => {
	console.log("/api-check_product_id");
	var product_id = req.body.product_id;
	Product.findOne({ product_id: product_id }, function(err, product) {
		if (!product) {
			// This is new product
			res.status(200).send({ code: 1, message: "OK", product_id: product_id });
		} else {
			res.status(200).send({ code: 2, message: "Product id was existed" });
		}
	});
});

module.exports = api_check_product_id;
