var express = require('express');
var Product = require('../models/product');
var postAuth = require('../controller/postAuthController')

var api_save_product = express.Router();

api_save_product.post("/api-save_product", postAuth.isAuthenticated, (req, res) => {
	console.log("/api-save_product");
	var product = req.body.product;
	var product_id = product.product_id;

	var date = new Date();
	// console.log(product_id);

	Product.findOne({ product_id: product_id }, function (err, pd) {
		if (!pd) {
			// This is new product
			var newProduct = new Product(product);

			// console.log(newProduct)
			newProduct.save(function (err) {
				if (err) {
					console.log(err);
					res.status(400).send({ code: 1004, message: "Error" });
				} else {
					console.log(
						date.toLocaleString("vi-GB", { timeZone: "Asia/Ho_Chi_Minh" }) +
						" - Save product to database"
					);
					res.status(200).send({ code: 1004, message: "Saved" });
				}
			});
		} else {
			pd.product_name = product.product_name;
			pd.description = product.description;
			pd.tasks = product.tasks;
			pd.precedence_relations = product.precedence_relations;
			pd.save(function (err) {
				if (err) {
					console.log(err);
					res.status(400).send({ code: 1004, message: "Error" });
				} else {
					console.log(
						date.toLocaleString("vi-GB", { timeZone: "Asia/Ho_Chi_Minh" }) +
						" - Save product to database"
					);
					res.status(200).send({ code: 1004, message: "Saved" });
				}
			});
		}
	});
});

module.exports = api_save_product;
