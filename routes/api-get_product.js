var express = require('express');
var fs = require('fs');
var cmd = require('node-cmd');
var os = require('os')
var Product = require("../models/product");
var api_get_product = express.Router();
api_get_product.get('/api-get_product', function (req, res) {
    return res.render('problem.html')
});


api_get_product.post('/api-get_product', function (req, res) {
    let _id = req.body.product._id
    Product.findOne({ _id: _id }, function (err, product) {
        if (err) throw err;

        if (!product) {
            res.status(200).send({ code: 9995, message: 'Product is not existed' });
        } else {
            res.send(product)
        }
    }); 
});

module.exports = api_get_product;