
var express = require('express');
var Product = require("../models/product");

var api_save_product = express.Router();

api_save_product.post('/api-save_product', (req, res) => {
    input_data = req.body.data;
    product_id = req.body.product_id
    product_name = req.body.product_name
    description = req.body.description
    output_data = req.body.output
    
    var date = new Date();

    var newProduct = new Product({
        product_id: product_id,
        product_name: product_name,
        description: description,
        input: input_data,
        output: output_data
    });
    // console.log(newProduct)
    newProduct.save(function (err) {
        if (err) {
            console.log(err)
            res.status(200).send({ code: 1004, message: 'Product it exist' });
        }
        else {
            console.log(date.toLocaleString('vi-GB', { timeZone: 'Asia/Ho_Chi_Minh' }) + ' - Save product to database')
            res.status(200).send({ code: 1004, message: 'Saved' });
        }
        
    });
});

module.exports = api_save_product;