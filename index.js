// Rerquire Node JS module
var express = require('express');
var path = require('path');
var bodyParser = require('body-parser');
var cons = require('consolidate');
var cmd = require('node-cmd');
var os = require('os');
var mongoose = require('mongoose');
var config = require('./config/database');
var favicon = require('express-favicon');

// Creat server app
var app = express();

//Set up database
// mongoose.Promise = global.Promise;
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
app.use(bodyParser.urlencoded({ extended: true }));

// ----------------- Router ---------------------------------- //

app.get('/', function (req, res) {
    return res.render('home.html');
});

app.get('/problem', function (req, res) {
    return res.render('problem.html');
});

var api_login = require('./routes/api-login');
app.use(api_login);

var api_get_product = require('./routes/api-get_product');
app.use(api_get_product);

var api_check_product_id = require('./routes/api-check_product_id');
app.use(api_check_product_id);

var api_save_product = require('./routes/api-save_product');
app.use(api_save_product);

var api_delete_product = require('./routes/api-delete_product');
app.use(api_delete_product);

var api_problem_1 = require('./routes/api-problem_1');
app.use(api_problem_1);


var api_problem_2 = require('./routes/api-problem_2');
app.use(api_problem_2);

var api_get_list_product = require('./routes/api-get_list_product');
app.use(api_get_list_product);



// ---------------------------------------------------------- //

app.use(favicon(__dirname + '/public/images/favicon.ico'));

//Re-complie program
// if (os.platform() == "win32") command = 'cd controller && gcc Problem1.cpp -lstdc++ -o Problem1.exe"';
// else command = 'cd controller &&  gcc Problem1.cpp -lstdc++ -o Problem1'
// cmd.get(
//     command,
//     function (err, data, stderr) {
//         if (err != null) {
//             console.log(err);
//         }
//     }
// );

// if (os.platform() == "win32") command = 'cd controller && gcc Problem2.cpp -lstdc++ -o Problem2.exe"';
// else command = 'cd controller &&  gcc Problem2.cpp -lstdc++ -o Problem2'
// cmd.get(
//     command,
//     function (err, data, stderr) {
//         if (err != null) {
//             console.log(err);
//         }
//     }
// );

// Start
app.listen(process.env.PORT || 3000, () => console.log('Server is listenning in port 3000'));
module.exports = app;