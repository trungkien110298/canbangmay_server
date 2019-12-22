var express = require('express');
var fs = require('fs');
var cmd = require('node-cmd');
var os = require('os')

var api_worker = express.Router();

api_worker.post('/api-worker', (req, res) => {
    // console.log(req.body)
    NCCN = req.body.NCCN;
    RBTT = req.body.RBTT;
    time = req.body.time;
    deviation = req.body.deviation;
    wattage = req.body.wattage;
    num_NCCN = NCCN.length;
    num_RBTT = RBTT.length;

    if (req.body.R != NaN){
        R = req.body.R;
    } else {
        R = parseInt(time)*parseInt(deviation);
    }
    

    str = num_NCCN.toString() + '\n' + R + '\n' + deviation + '\n';

    for (i in NCCN) {
        nccn = NCCN[i];
        stt = parseInt(i) + 1;
        str += stt.toString() + " " + nccn.device + " " + nccn.kind + " " + nccn.time + " " + nccn.level +"\n";
    }

    str += num_RBTT.toString() + "\n"
    for (i in RBTT) {
        rbtt = RBTT[i];
        str += rbtt.nccn_1 + " " + rbtt.nccn_2 + "\n";
    }
    


    // var text = fs.readFileSync("./.temp/template.txt");
    // str += text;

    fs.writeFileSync("./.temp/input.txt", str);
    date =  new Date();
    console.log(date.toLocaleString('vi-GB', { timeZone: 'Asia/Ho_Chi_Minh' }) + ' - Save input file!')

    if (os.platform() == "win32") command = 'cd controller && start Problem1.exe';
    else command = 'cd controller &&  ./Problem1'
    cmd.get(
        command,
        function (err, data, stderr) {
            if (err != null){
                console.log(err);
            }
            
            var text = fs.readFileSync("./.temp/output.json");
            output_data = JSON.parse(text);
            output_data.NCCN = NCCN;
            output_data.rmin = parseInt(R) - parseInt(R)*deviation/100;
            output_data.rmax = parseInt(R) + parseInt(R)*deviation/100;
            text = JSON.stringify(output_data)
            res.send(output_data);
            console.log(date.toLocaleString('vi-GB', { timeZone: 'Asia/Ho_Chi_Minh' }) + ' - Send output file!')
        }
    );


});

module.exports = api_worker;