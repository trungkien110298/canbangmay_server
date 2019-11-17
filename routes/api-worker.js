var express = require('express');
var fs = require('fs');
var cmd = require('node-cmd');


var api_worker = express.Router();

api_worker.post('/api-worker', (req, res) => {
    NCCN = req.body.NCCN;
    RBTT = req.body.RBTT;
    time = req.body.time;
    deviation = req.body.deviation;
    wattage = req.body.wattage;
    num_NCCN = NCCN.length;
    num_RBTT = RBTT.length;

    // R = parseInt(time)*parseInt(deviation);
    R = req.body.R;

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
    for (i in NCCN) {
        nccn = NCCN[i];
        str +=  nccn.name +"\n";
    }


    var text = fs.readFileSync("./.temp/template.txt");
    str += text;

    fs.writeFile("./.temp/input.txt", str, function (err) {
        if (err) {
            return console.log(err);
        }
        console.log("The file input was saved!");
    });

    cmd.get(
        'cd controller && start Problem1.exe',
        function (err, data, stderr) {
            if (err != null){
                console.log(err);
            }
            
            var text = fs.readFileSync("./.temp/output.json");
            res.send(text);
        }
    );


});

module.exports = api_worker;