// Rerquire Node JS module
var express = require('express');
var path = require('path');
var bodyParser = require('body-parser');
var cons = require('consolidate');
var cmd = require('node-cmd');
var os = require('os')


// Creat server app
var app = express();

// View engine setup
app.engine('html', cons.swig)
app.set("view engine", "html");
app.set("views", "./views");
app.use(express.static(path.join(__dirname, 'public')));
app.use('/bower_components',  express.static(__dirname + '/bower_components'));


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.get('/', function(req, res){
    return res.render('view_op_worker.html')
});

var api_worker = require('./routes/api-worker')
app.use('/api', api_worker);


// var upload = multer({ storage: storage }).single('uploadfile');
// app.use(favicon(__dirname + '/public/image/favicon.ico'));
if (os.platform() == "win32") command = 'cd controller && gcc Problem1.cpp -lstdc++ -o Problem1.exe"';
    else command = 'cd controller &&  gcc Problem1.cpp -lstdc++ -o Problem1'
cmd.get(
    command,
    function (err, data, stderr) {
        if (err != null){
            console.log(err);
        }
    }
);


app.listen(process.env.PORT || 3000, () => console.log('Server is listenning in port 3000'));
module.exports = app;