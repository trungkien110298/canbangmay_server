// Rerquire Node JS module
var express = require('express');
var path = require('path');
var bodyParser = require('body-parser');
var cons = require('consolidate');



// Creat server app
var app = express();

// View engine setup
app.engine('html', cons.swig)
app.set("view engine", "html");
app.set("views", "./views");
app.use(express.static(path.join(__dirname, 'public')));


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.get('/', function(req, res){
    return res.render('view_op_worker.html')
});



// var upload = multer({ storage: storage }).single('uploadfile');
// app.use(favicon(__dirname + '/public/image/favicon.ico'));



app.listen(process.env.PORT || 3000, () => console.log('Server is listenning in port 3000'));
module.exports = app;