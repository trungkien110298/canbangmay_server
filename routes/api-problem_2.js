var express = require('express');
var fs = require('fs');
var cmd = require('node-cmd');
var os = require('os')
var Product = require("../models/product");

var api_problem_2 = express.Router();

api_problem_2.post('/api-problem_2', (req, res) => {
    console.log('/api-problem_2');
    input_data = req.body.data;
    product_id = req.body.product_id
    product_name = req.body.product_name
    description = req.body.description
    

    NCCN = input_data.NCCN;
    RBTT = input_data.RBTT;
    num_worker = input_data.num_worker;
    deviation = input_data.deviation;
    num_NCCN = NCCN.length;
    num_RBTT = RBTT.length;


   

    //Create input for C++ program
    str = num_NCCN.toString() + '\n' + num_worker + '\n' + deviation + '\n';

    for (i in NCCN) {
        nccn = NCCN[i];
        stt = parseInt(i) + 1;
        str += stt.toString() + " " + nccn.device + " " + nccn.kind + " " + nccn.time + " " + nccn.level + "\n";
    }

    str += num_RBTT.toString() + "\n"
    for (i in RBTT) {
        rbtt = RBTT[i];
        str += rbtt.nccn_1 + " " + rbtt.nccn_2 + "\n";
    }

    fs.writeFileSync("./temp/input_p2.txt", str);
    date = new Date();
    console.log(date.toLocaleString('vi-GB', { timeZone: 'Asia/Ho_Chi_Minh' }) + ' - Save input file!')

    //Run C++ program
    if (os.platform() == "win32") command = 'cd controller && start Problem2.exe';
    else command = 'cd controller &&  ./Problem2'
    cmd.get(
        command,
        //Send output
        function (err, data, stderr) {
            if (err != null) {
                console.log(err);
            }

            var text = fs.readFileSync("./temp/output_p2.json");
            output_data = JSON.parse(text);
            output_data.NCCN = NCCN;
            let R = output_data.R;
            output_data.rmin = parseInt(R) - parseInt(R) * deviation / 100;
            output_data.rmax = parseInt(R) + parseInt(R) * deviation / 100;
            text = JSON.stringify(output_data)
            res.send(output_data);
            console.log(date.toLocaleString('vi-GB', { timeZone: 'Asia/Ho_Chi_Minh' }) + ' - Send output file!')
            var newProduct = new Product({
                product_id: product_id,
                product_name: product_name,
                description: description,
                input: input_data,
                output: output_data
            });
            console.log(newProduct)
            newProduct.save(function (err) {
                // if (err) {
                //     console.log(err)
                // }
                // else {
                //     console.log(date.toLocaleString('vi-GB', { timeZone: 'Asia/Ho_Chi_Minh' }) + ' - Save product to database')
                // }
                console.log("Hey Jude")
                console.log(err)
            });
        }
    );




});



module.exports = api_problem_2;