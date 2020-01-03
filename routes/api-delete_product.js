var express = require('express');
var Product = require("../models/product");

var api_delete_product = express.Router();

api_delete_product.post('/api-delete_product', (req, res) => {
    _id = req.body.product._id

    console.log("Delete product: " + _id)
    Product.deleteOne({ _id: _id }, function (err) {
        if (err) throw err
        else res.send({ code: 200, message: 'Delete success' })
    });
    res.send({ code: 200, message: 'Delete success' })
});

module.exports = api_delete_product;