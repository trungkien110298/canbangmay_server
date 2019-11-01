var express = require('express');
var api_worker = express.Router();

api_worker.post('/api-worker', (req, res) => {
    console.log(req.body)
    res.render('view_op_h.html')
});

module.exports = api_worker;