var express = require('express');
var Product = require('../models/product')


var api_get_list_product = express.Router();

api_get_list_product.get('/api-get_list_product', (req, res) => {
    console.log('/api-get_list_product');
    Product.find({}, function (err, products) {
        var list_product = [];

        products.forEach(function (product) {
            list_product.push(product)
        });

        let data = { "list_product": list_product }
        res.send(data);
    });
});

module.exports = api_get_list_product;