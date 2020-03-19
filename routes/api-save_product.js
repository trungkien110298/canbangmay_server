
var express = require('express');
var Product = require("../models/product");

var api_save_product = express.Router();

api_save_product.post('/api-save_product', (req, res) => {
    console.log('/api-save_product');
    var data = req.body.data;
    var product_id = req.body.product_id;
    var product_name = req.body.product_name;
    var description = req.body.description;
    var tasks = data.tasks;
    var precedence_relations = data.precedence_relations;
    
    var date = new Date();
    // console.log(product_id);
    
    
    Product.findOne({ product_id: product_id }, function (err, product) {
        if (!product){ // This is new product
            var newProduct = new Product({
                product_id: product_id,
                product_name: product_name,
                description: description,
                tasks: tasks,
                precedence_relations: precedence_relations
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
            product.product_name = product_name;
            product.description = description;
            product.tasks = tasks;
            product.precedence_relations = precedence_relations;
        }
    })
    
});

module.exports = api_save_product;