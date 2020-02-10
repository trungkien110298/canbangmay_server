
var express = require('express');
var Product = require("../models/product");

var api_save_product = express.Router();

api_save_product.post('/api-save_product', (req, res) => {
    var data = req.body.data;
    var product_id = req.body.product_id;
    var product_name = req.body.product_name;
    var description = req.body.description;

    
    var date = new Date();
    // console.log(product_id);
    
    Product.findOne({ product_id: product_id }, function (err, product) {
        if (!product){ // This is new product
            var newProduct = new Product({
                product_id: product_id,
                product_name: product_name,
                description: description,
                data: data
            });

            // console.log(newProduct)
            newProduct.save(function (err) {
                if (err) {
                    console.log(err)
                    res.status(400).send({ code: 1004, message: 'Error' });
                }
                else {
                    console.log(date.toLocaleString('vi-GB', { timeZone: 'Asia/Ho_Chi_Minh' }) + ' - Save product to database')
                    res.status(200).send({ code: 1004, message: 'Saved' });
                }
    
            });
        } else {
            console.log("Product existed")
            res.status(200).send({ code: 1010, message: 'Product was existed' });
        }
    })
    
});

module.exports = api_save_product;