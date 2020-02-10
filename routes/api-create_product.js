var express = require('express');
var Product = require("../models/product");

var api_check_product_id = express.Router();

api_check_product_id.post('/api-check_product_id', (req, res) => {
    var product_id = req.body.product_id;

    
    Product.findOne({ product_id: product_id }, function (err, product) {
        if (!product){ // This is new product
            var newProduct = new Product({
                product_id: product_id,
                product_name: product_name,
                description: description
            });
            newProduct.save(function (err) {
                if (err) {
                    console.log(err)
                    res.status(200).send({ code: 0, message: 'Error' });
                }
                else {
                    res.status(200).send({ code: 1, message: 'OK', product_id: product_id });
                }
            });
        } else {
            res.status(200).send({ code: 2, message: 'Product id was existed' });
        }
    })
});

module.exports = api_check_product_id;