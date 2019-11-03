var express = require('express');
var fs =require('fs');
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

    str =   num_NCCN.toString() + '\n' + R + '\n';

    for (i in NCCN){
        nccn = NCCN[i];
        stt = parseInt(i)+1;
        str += stt.toString() + " " + nccn.device + " " + nccn.kind + " " + nccn.time + "\n";
    }

    str += num_RBTT.toString() + "\n"
    for (i in RBTT){
        rbtt = RBTT[i];
        str += rbtt.nccn_1 + " " + rbtt.nccn_2 + "\n";
    }
    var text = fs.readFileSync("./.temp/template.txt");
    str += text;

    fs.writeFile("./.temp/test.txt", str, function(err) {
        if(err) {
            return console.log(err);
        }
        console.log("The file was saved!");
    }); 

    res.render('view_op_h.html')
});

module.exports = api_worker;