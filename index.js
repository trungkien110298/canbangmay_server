// Rerquire Node JS module
var express = require('express');
var path = require('path');
var bodyParser = require('body-parser');
var cons = require('consolidate');
var cmd = require('node-cmd');
var os = require('os');
var mongoose = require('mongoose');
var config = require('./config/database');


// Creat server app
var app = express();

//Set up database
mongoose.Promise = global.Promise;
mongoose.connect(config.database, {
    useNewUrlParser: true,
    useUnifiedTopology: true
});
mongoose.set('useCreateIndex', true);

// View engine setup
app.engine('html', cons.swig)
app.set("view engine", "html");
app.set("views", "./views");
app.use(express.static(path.join(__dirname, 'public')));
app.use('/bower_components', express.static(__dirname + '/bower_components'));

//body Parser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

//router
app.get('/', function (req, res) {
    return res.render('home.html')
});

var api_get_product = require('./routes/api-get_product');
app.use(api_get_product);


var api_worker = require('./routes/api-worker');
app.use(api_worker);

var api_get_list_product = require('./routes/api-get_list_product');
app.use(api_get_list_product);


// var upload = multer({ storage: storage }).single('uploadfile');
// app.use(favicon(__dirname + '/public/image/favicon.ico'));

//Re-complie program
if (os.platform() == "win32") command = 'cd controller && gcc Problem1.cpp -lstdc++ -o Problem1.exe"';
else command = 'cd controller &&  gcc Problem1.cpp -lstdc++ -o Problem1'
cmd.get(
    command,
    function (err, data, stderr) {
        if (err != null) {
            console.log(err);
        }
    }
);

// Start
app.listen(process.env.PORT || 3000, () => console.log('Server is listenning in port 3000'));
module.exports = app;